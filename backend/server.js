const express = require('express');
const cors = require('cors');
const { getExtendedPlayerInfo } = require('./utils');
const nba = require('nba');
const app = express();
const port = 3001;

app.use(cors());

// Endpoints

app.get('/player-stats/:id', async (req, res) => {
    const { id } = req.params;
    const { season } = req.query;
    try {
        const playerStats = await nba.stats.playerProfile({ PlayerID: id, Season: season });
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
        const players = teamPlayerDashboard.playersSeasonTotals;
        const extendedPlayers = await getExtendedPlayerInfo(players);
        res.json({
            teamOverall: teamPlayerDashboard.teamOverall,
            playersSeasonTotals: extendedPlayers
        });
    } catch (error) {
        console.error('Error fetching team player dashboard:', error);
        res.status(500).send('Error fetching team player dashboard');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
