import React, { useEffect, useState } from 'react';
import { fetchTeamStats, fetchPlayerStats } from "../actions";
import PlayerList from '../components/PlayerList';
import { TEAMS, SEASONS } from "../constants";

function App() {
  const [season, setSeason] = useState(SEASONS[0]);
  const [teamID, setTeamID] = useState(TEAMS[3].id);
  const [players, setPlayers] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);

  useEffect(() => {
    const fetchAndSetData = async () => {
      setPlayers([]);
      setTeamData(null);
      const data = await fetchTeamStats(teamID, season);
      setPlayers(data["playersSeasonTotals"]);
      setTeamData(data["teamOverall"][0]);
    };
  
    fetchAndSetData();
  }, [season, teamID]);
  

  const handleCardClick = async (player) => {
    setSelectedPlayer(player);
    const data = await fetchPlayerStats(player.playerId, season);
    setPlayerStats(data);
  };

  return (
    <div>
      <PlayerList />
    </div>
  );
}

export default App;
