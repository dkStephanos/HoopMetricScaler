const express = require('express');
const cors = require('cors');
const nba = require('nba');
const bodyParser = require('body-parser');
const { getExtendedPlayerInfo } = require('./utils');
const { initializeModel } = require('./ml'); // Adjust the path as needed
const logger = require('./logger');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/scale-stats', (req, res) => {
    const { minutes, usage, selectedRows } = req.body;
    const model = JSON.parse(fs.readFileSync('./model.json'));

    if (!model) {
        return res.status(400).send('Model not trained yet');
    }

    if (!selectedRows || selectedRows.length === 0) {
        return res.status(400).send('No rows selected');
    }

    const scaledStats = model.predict([minutes, usage]);
    res.json({ scaledStats: scaledStats[1] });
});

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

initializeModel().then(() => {
    app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
    });
});
