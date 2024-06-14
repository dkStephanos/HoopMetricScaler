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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
