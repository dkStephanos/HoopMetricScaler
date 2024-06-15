const express = require('express');
const cors = require('cors');
const { getExtendedPlayerInfo } = require('./utils');
const nba = require('nba');
const app = express();
const port = 3001;

app.use(cors());

app.get('/player-stats/:id', async (req, res) => {
    const { id } = req.params;
    const { season } = req.query;
    try {
        const playerStats = await nba.stats.playerProfile({ PlayerID: id, Season: season });
        const extendedPlayerInfo = await getExtendedPlayerInfo(id);
        res.json({ ...playerStats, ...extendedPlayerInfo });
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
        res.json({
            teamOverall: teamPlayerDashboard.teamOverall,
            playersSeasonTotals: players
        });
    } catch (error) {
        console.error('Error fetching team player dashboard:', error);
        res.status(500).send('Error fetching team player dashboard');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
