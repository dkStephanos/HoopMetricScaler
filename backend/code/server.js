const express = require("express");
const cors = require("cors");
const nba = require("nba");
const bodyParser = require("body-parser");
const regression = require('regression');
const { getExtendedPlayerInfo } = require("./utils");
const { initializeModels } = require("./ml"); // Adjust the path as needed
const logger = require("./logger");
const fs = require("fs");

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

function normalize(value, min, max) {
  return (value - min) / (max - min);
}

function denormalize(value, min, max) {
  return value * (max - min) + min;
}

app.post('/scale-stats', (req, res) => {
    const { minutes, usage, selectedRows, init } = req.body;

    if (!init) {
        const modelsData = JSON.parse(fs.readFileSync('./data/models.json'));
        const models = {};
        for (const stat in modelsData) {
          const data = modelsData[stat];
          if (Array.isArray(data)) {
            models[stat] = regression.linear(data);
          } else {
            return res.status(400).send(`Model data for ${stat} is not an array`);
          }
        }
      
        
          if (!models) {
            return res.status(400).send('Models not trained yet');
          }
    }
  
    if (!selectedRows || selectedRows.length === 0) {
      return res.status(400).send('No rows selected');
    }
  
    const stats = ['PTS', 'TRB', 'trueShooting', 'assistToTurnover', 'stocks'];
    const minMax = {};
  
    // Load historical data to get min/max for normalization
    const historicalData = fs.readFileSync('./data/normalizedData.csv', 'utf-8').split('\n').slice(1).map(line => {
      const [PTS, TRB, trueShooting, assistToTurnover, stocks, minutesPlayed, usage] = line.split(',');
      return {
        PTS: parseFloat(PTS),
        TRB: parseFloat(TRB),
        trueShooting: parseFloat(trueShooting),
        assistToTurnover: parseFloat(assistToTurnover),
        stocks: parseFloat(stocks),
        minutesPlayed: parseFloat(minutesPlayed),
        usage: parseFloat(usage)
      };
    });
  
    stats.forEach(stat => {
      const values = historicalData.map(player => player[stat]);
      minMax[stat] = { min: Math.min(...values), max: Math.max(...values) };
    });
  
    // Include minutesPlayed and usage in minMax
    const minutesPlayedValues = historicalData.map(player => player.minutesPlayed);
    minMax.minutesPlayed = { min: Math.min(...minutesPlayedValues), max: Math.max(...minutesPlayedValues) };
  
    const usageValues = historicalData.map(player => player.usage);
    minMax.usage = { min: Math.min(...usageValues), max: Math.max(...usageValues) };
  
    const normalizedRows = selectedRows.map(row => {
        const trueShooting = row.pts / (2 * (row.fga + 0.44 * row.fta)) || 0;
        const assistToTurnover = row.ast / row.tov || 0;
        const stocks = row.stl + row.blk || 0;
        const usage = (row.fga + 0.44 * row.fta + row.tov) / row.min || 0;
      
        return {
          PTS: normalize(row.pts, minMax.PTS.min, minMax.PTS.max),
          TRB: normalize(row.reb, minMax.TRB.min, minMax.TRB.max),
          trueShooting: normalize(trueShooting, minMax.trueShooting.min, minMax.trueShooting.max),
          assistToTurnover: normalize(assistToTurnover, minMax.assistToTurnover.min, minMax.assistToTurnover.max),
          stocks: normalize(stocks, minMax.stocks.min, minMax.stocks.max),
          minutesPlayed: row.min,  // Don't normalize minutes
          usage: usage,            // Don't normalize usage
        };
      });
      
      // Calculate averages for the normalized rows
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
        return res.json({ normalizedRows: [averageRow] });
      }
      
      // Use the models to scale the averaged normalized row
      const scaledStats = {};
      stats.forEach(stat => {
        const model = models[stat];
        const result = model.predict([[averageRow.minutesPlayed, averageRow.usage]]);  // Use raw minutes and usage
        scaledStats[stat] = denormalize(result[1], minMax[stat].min, minMax[stat].max);
      });
      
      res.json({ scaledStats });
      
      
  });

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

initializeModels().then(() => {
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
});
