const nba = require('nba');

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

module.exports = { getPlayersForSeasonAndTeam, getAdvancedPlayerStats };
