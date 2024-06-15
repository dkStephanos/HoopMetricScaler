const nba = require('nba');

const getPlayerInfo = async (playerId) => {
    try {
        const playerInfo = await nba.stats.playerInfo({ PlayerID: playerId });
        return playerInfo.commonPlayerInfo[0];
    } catch (error) {
        console.error('Error fetching player info:', error);
        throw new Error('Error fetching player info');
    }
};

const getExtendedPlayerInfo = async (players) => {
    const extendedPlayers = await Promise.all(players.map(async (player) => {
        const info = await getPlayerInfo(player.playerId);
        return {
            ...player,
            ...info
        };
    }));
    console.log(extendedPlayers)
    return extendedPlayers;
};

module.exports = {
    getExtendedPlayerInfo
};
