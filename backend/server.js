const express = require('express');
const cors = require('cors');
const nba = require('nba');
const app = express();
const port = 3001;

app.use(cors());

// Utils
const getPlayersForSeasonAndTeam = async (season, teamID) => {
    try {
        const roster = await nba.stats.commonTeamRoster({ Season: season, TeamID: teamID });
        return roster.commonTeamRoster.map(player => ({
            id: player.playerId,
            name: player.player,
            team: roster.commonTeamRoster[0].teamName,
            position: player.position
        }));
    } catch (error) {
        console.error('Error fetching players:', error);
        throw new Error('Error fetching players');
    }
};

const getAdvancedPlayerStats = async (playerId, season) => {
    try {
        const stats = await nba.stats.playerProfile({ PlayerID: playerId, Season: season });
        return stats;
    } catch (error) {
        console.error('Error fetching player stats:', error);
        throw new Error('Error fetching player stats');
    }
};

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

app.get('/players', async (req, res) => {
    const { season, teamID } = req.query;
    try {
        const players = await getPlayersForSeasonAndTeam(season, teamID);
        res.json(players);
    } catch (error) {
        res.status(500).send('Error fetching players');
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
