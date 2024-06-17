const nba = require('nba');

const getExtendedPlayerInfo = async (playerId) => {
    try {
        return await nba.stats.playerInfo({ PlayerID: playerId });
    } catch (error) {
        console.error('Error fetching player info:', error);
        throw new Error('Error fetching player info');
    }
};

function applyScalingFactors(initialStats, scalingFactors) {
    return {
      PTS: initialStats.PTS * scalingFactors.PTS_scaling,
      TRB: initialStats.TRB * scalingFactors.TRB_scaling,
      trueShooting: initialStats.trueShooting * scalingFactors.trueShooting_scaling,
      assistToTurnover: initialStats.assistToTurnover * scalingFactors.assistToTurnover_scaling,
      stocks: initialStats.stocks * scalingFactors.stocks_scaling,
      minutesPlayed: initialStats.minutesPlayed,
      usage: initialStats.usage,
    };
  }
  

module.exports = {
    getExtendedPlayerInfo,
    applyScalingFactors
};
