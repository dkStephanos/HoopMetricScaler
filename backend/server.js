const express = require('express');
const cors = require('cors');
const { getExtendedPlayerInfo } = require('./utils');
const nba = require('nba');
const logger = require('./logger'); // Import the logger
const app = express();
const port = 3001;

app.use(cors());

app.get('/player-stats/:id', async (req, res) => {
    const { id } = req.params;
    const { season } = req.query;
    try {
        logger.info(`Fetching player stats for PlayerID: ${id}, Season: ${season}`);
        const playerStats = await nba.stats.playerProfile({ PlayerID: id, Season: season });
        const extendedPlayerInfo = await getExtendedPlayerInfo(id);
        res.json({ ...playerStats, ...extendedPlayerInfo });
    } catch (error) {
        logger.error(`Error fetching player stats: ${error.message}`);
        res.status(500).send('Error fetching player stats');
    }
});

app.get('/team-player-dashboard/:teamId', async (req, res) => {
    const { teamId } = req.params;
    const { season } = req.query;
    try {
        logger.info(`Fetching team player dashboard for TeamID: ${teamId}, Season: ${season}`);
        const teamPlayerDashboard = await nba.stats.teamPlayerDashboard({ TeamID: teamId, Season: season });
        const players = teamPlayerDashboard.playersSeasonTotals;
        res.json({
            teamOverall: teamPlayerDashboard.teamOverall,
            playersSeasonTotals: players
        });
    } catch (error) {
        logger.error(`Error fetching team player dashboard: ${error.message}`);
        res.status(500).send('Error fetching team player dashboard');
    }
});

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
