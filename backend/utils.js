const nba = require('nba');

const getExtendedPlayerInfo = async (playerId) => {
    try {
        return await nba.stats.playerInfo({ PlayerID: playerId });
    } catch (error) {
        console.error('Error fetching player info:', error);
        throw new Error('Error fetching player info');
    }
};

module.exports = {
    getExtendedPlayerInfo
};
