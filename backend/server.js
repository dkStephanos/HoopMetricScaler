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
            team: roster.commonTeamRoster[0].teamName, // Assuming all players in the same team have the same team name
            position: player.position
        }));
    } catch (error) {
        console.error('Error fetching players:', error);
        throw new Error('Error fetching players');
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


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
