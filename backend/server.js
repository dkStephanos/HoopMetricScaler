const express = require('express');
const cors = require('cors');
const nba = require('nba');
const app = express();
const port = 3001;

app.use(cors());

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
    const { season } = req.query;
    try {
        // Get all teams for the season
        const teams = await nba.stats.teamInfoCommon({ Season: season, TeamID: "1610612737" });
        let allPlayers = [];
        console.log(teams)
        for (const team of teams.teamInfoCommon) {
            // Get roster for each team
            const roster = await nba.stats.commonTeamRoster({ Season: season, TeamID: team.teamId });
            allPlayers = allPlayers.concat(roster.commonTeamRoster.map(player => ({
                id: player.playerId,
                name: player.player,
                team: team.teamName,
                position: player.position
            })));
        }
        console.log(allPlayers)
        res.json(allPlayers);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).send('Error fetching players');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
