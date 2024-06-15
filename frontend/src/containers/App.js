import React, { useEffect, useState } from "react";
import { fetchTeamStats, fetchPlayerStats } from "../actions";
import PlayerList from "../components/PlayerList";
import TeamSummaryCard from "../components/TeamSummaryCard";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Container
} from "@mui/material";
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

  const handleCloseModal = () => {
    setSelectedPlayer(null);
    setPlayerStats(null);
  };

  const handleSeasonChange = (e) => {
    setSeason(e.target.value);
  };

  const handleTeamChange = (e) => {
    setTeamID(e.target.value);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          NBA Players
        </Typography>
        <Select
          value={season}
          onChange={handleSeasonChange}
          displayEmpty
          fullWidth
          sx={{ mb: 2 }}
        >
          {SEASONS.map((season) => (
            <MenuItem key={season} value={season}>
              {season}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={teamID}
          onChange={handleTeamChange}
          displayEmpty
          fullWidth
          sx={{ mb: 2 }}
        >
          {TEAMS.map((team) => (
            <MenuItem key={team.id} value={team.id}>
              {team.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <TeamSummaryCard teamSummary={teamData} />
      {teamData && <PlayerList
        players={players}
        selectedPlayer={selectedPlayer}
        playerStats={playerStats}
        handleCardClick={handleCardClick}
        handleCloseModal={handleCloseModal}
      />}
    </Container>
  );
}

export default App;
