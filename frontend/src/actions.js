export const fetchTeamStats = async (teamID, season) => {
  try {
    const response = await fetch(
      `http://localhost:3001/team-player-dashboard/${teamID}?season=${season}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching players:", error);
  }
};

export const fetchPlayerStats = async (playerId, season) => {
  try {
    const response = await fetch(
      `http://localhost:3001/player-stats/${playerId}?season=${season}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching player stats:", error);
  }
};
