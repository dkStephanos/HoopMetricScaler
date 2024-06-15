const express = require('express');
const cors = require('cors');
const nba = require('nba');
const { getPlayersForSeasonAndTeam, getAdvancedPlayerStats } = require('./utils');
const app = express();
const port = 3001;

app.use(cors());


// Endpoints
app.get('/player/:name', async (req, res) => {
    const player = nba.findPlayer(req.params.name);
    if (player) {
        const playerInfo = await nba.stats.playerInfo({ PlayerID: player.playerId });
        res.json(playerInfo);
    } else {
        res.status(404).send('Player not found');
    }
});

app.get('/player-stats/:id', async (req, res) => {
    const { id } = req.params;
    const { season } = req.query;
    try {
        const playerStats = await getAdvancedPlayerStats(id, season);
        res.json(playerStats);
    } catch (error) {
        res.status(500).send('Error fetching player stats');
    }
});

app.get('/team-player-dashboard/:teamId', async (req, res) => {
    const { teamId } = req.params;
    const { season } = req.query;
    try {
      const teamPlayerDashboard = await nba.stats.teamPlayerDashboard({ TeamID: teamId, Season: season });
      res.json(teamPlayerDashboard);
    } catch (error) {
      console.error('Error fetching team player dashboard:', error);
      res.status(500).send('Error fetching team player dashboard');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
