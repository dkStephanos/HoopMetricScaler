const express = require("express");
const cors = require("cors");
const nba = require("nba");
const bodyParser = require("body-parser");
const regression = require("regression");
const { getExtendedPlayerInfo, applyScalingFactors } = require("./utils");
const { initializeModels, normalize } = require("./ml");
const logger = require("./logger");
const fs = require("fs");
const csv = require("csv-parser");

const PORT = 3001;
const app = express();

app.use(cors());
app.use(bodyParser.json());

// ---------------- STAT SCALING ----------------
app.post('/scale-stats', (req, res) => {
    const { minutes, usage, selectedRows, init } = req.body;
    logger.info(`Scaling stats with: ${minutes}, ${usage}, ${init} ${typeof init}`);
  
    const modelsData = JSON.parse(fs.readFileSync('./data/models.json'));
    const models = {};
    for (const stat in modelsData) {
      const data = modelsData[stat].points;
      if (Array.isArray(data)) {
        models[stat] = regression.linear(data);
      } else {
        return res.status(400).send(`Model data for ${stat} is not an array`);
      }
    }
  
    if (!Object.keys(models).length) {
      return res.status(400).send('Models not trained yet');
    }
  
    if (!selectedRows || selectedRows.length === 0) {
      return res.status(400).send('No rows selected');
    }
  
    // Load historical aggregated data to get min/max for normalization
    const aggregatedData = [];
    fs.createReadStream('./data/aggregatedData.csv')
      .pipe(csv())
      .on('data', (row) => {
        aggregatedData.push(row);
      })
      .on('end', () => {
        const perGameData = aggregatedData.map(player => ({
          PTS: parseFloat(player.PTS) / parseFloat(player.games),
          TRB: parseFloat(player.TRB) / parseFloat(player.games),
          trueShooting: parseFloat(player.trueShooting),
          assistToTurnover: parseFloat(player.assistToTurnover),
          stocks: parseFloat(player.stocks),
          minutesPlayed: parseFloat(player.minutesPlayed),
          usage: parseFloat(player.usage)
        }));
  
        const minMax = {};
        const STATS = ['PTS', 'TRB', 'trueShooting', 'assistToTurnover', 'stocks'];
  
        STATS.forEach(stat => {
          const values = perGameData.map(player => player[stat]);
          minMax[stat] = { min: Math.min(...values), max: Math.max(...values) };
        });
  
        minMax.minutesPlayed = { min: Math.min(...perGameData.map(player => player.minutesPlayed)), max: Math.max(...perGameData.map(player => player.minutesPlayed)) };
        minMax.usage = { min: Math.min(...perGameData.map(player => player.usage)), max: Math.max(...perGameData.map(player => player.usage)) };
  
        const normalizedRows = selectedRows.map(row => {
          const trueShooting = row.pts / (2 * (row.fga + 0.44 * row.fta)) || 0;
          const assistToTurnover = (row.ast / row.tov) * Math.sqrt(row.ast) || 0;
          const stocks = row.stl + row.blk || 0;
          const usage = (row.fga + 0.44 * row.fta + row.tov) / row.min || 0;
  
          return {
            PTS: normalize(row.pts, minMax.PTS.min, minMax.PTS.max),
            TRB: normalize(row.reb, minMax.TRB.min, minMax.TRB.max),
            trueShooting: normalize(trueShooting, minMax.trueShooting.min, minMax.trueShooting.max),
            assistToTurnover: normalize(assistToTurnover, minMax.assistToTurnover.min, minMax.assistToTurnover.max),
            stocks: normalize(stocks, minMax.stocks.min, minMax.stocks.max),
            minutesPlayed: row.min,
            usage: usage,
          };
        });
  
        const averageRow = {
          PTS: normalizedRows.reduce((acc, row) => acc + row.PTS, 0) / normalizedRows.length,
          TRB: normalizedRows.reduce((acc, row) => acc + row.TRB, 0) / normalizedRows.length,
          trueShooting: normalizedRows.reduce((acc, row) => acc + row.trueShooting, 0) / normalizedRows.length,
          assistToTurnover: normalizedRows.reduce((acc, row) => acc + row.assistToTurnover, 0) / normalizedRows.length,
          stocks: normalizedRows.reduce((acc, row) => acc + row.stocks, 0) / normalizedRows.length,
          minutesPlayed: normalizedRows.reduce((acc, row) => acc + row.minutesPlayed, 0) / normalizedRows.length,
          usage: normalizedRows.reduce((acc, row) => acc + row.usage, 0) / normalizedRows.length
        };
  
        if (init) {
          logger.info(`Returning early from scale stats for init`);
          return res.json({ normalizedRows: [averageRow] });
        }
  
        const scalingFactors = {};
        STATS.forEach(stat => {
          const model = models[stat];
          const result = model.predict([[minutes * usage]]);
          scalingFactors[stat] = result[1];
        });
  
        const scaledStats = {};
        STATS.forEach(stat => {
          scaledStats[stat] = averageRow[stat] + (scalingFactors[stat] - averageRow[stat]);
        });
        scaledStats["minutesPlayed"] = minutes;
        scaledStats["usage"] = usage;
  
        res.json({ scaledStats });
      });
  });
  


// ---------------- PLAYER STATS ----------------
app.get("/player-stats/:id", async (req, res) => {
  const { id } = req.params;
  const { season } = req.query;
  try {
    logger.info(`Fetching player stats for PlayerID: ${id}, Season: ${season}`);
    const playerStats = await nba.stats.playerProfile({
      PlayerID: id,
      Season: season,
    });
    const extendedPlayerInfo = await getExtendedPlayerInfo(id);
    res.json({ ...playerStats, ...extendedPlayerInfo });
  } catch (error) {
    logger.error(`Error fetching player stats: ${error.message}`);
    res.status(500).send("Error fetching player stats");
  }
});

// ---------------- TEAM PLAYER DASH ----------------
app.get("/team-player-dashboard/:teamId", async (req, res) => {
  const { teamId } = req.params;
  const { season } = req.query;
  try {
    logger.info(
      `Fetching team player dashboard for TeamID: ${teamId}, Season: ${season}`
    );
    const teamPlayerDashboard = await nba.stats.teamPlayerDashboard({
      TeamID: teamId,
      Season: season,
    });
    const players = teamPlayerDashboard.playersSeasonTotals;
    res.json({
      teamOverall: teamPlayerDashboard.teamOverall,
      playersSeasonTotals: players,
    });
  } catch (error) {
    logger.error(`Error fetching team player dashboard: ${error.message}`);
    res.status(500).send("Error fetching team player dashboard");
  }
});

// Launch server once models are loaded
initializeModels().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
});
