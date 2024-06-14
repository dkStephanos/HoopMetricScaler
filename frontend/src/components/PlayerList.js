import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Select, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PlayerModal from "./PlayerModal";
import { TEAMS, SEASONS } from "../constants";

function PlayerList() {
  const [season, setSeason] = useState(SEASONS[0]);
  const [teamID, setTeamID] = useState(TEAMS[3].id);
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/players?season=${season}&teamID=${teamID}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    fetchPlayers();
  }, [season, teamID]);

  const handleRowClick = async (params) => {
    const player = params.row;
    setSelectedPlayer(player);
    try {
      const response = await fetch(
        `http://localhost:3001/player-stats/${player.id}?season=${season}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPlayerStats(data);
    } catch (error) {
      console.error("Error fetching player stats:", error);
    }
  };

  const columns = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "position", headerName: "Position", width: 150 },
    { field: "height", headerName: "Height", width: 100 },
    { field: "weight", headerName: "Weight", width: 100 },
    { field: "teamAbbreviation", headerName: "Team", width: 100 },
  ];

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          NBA Players
        </Typography>
        <Select
          value={season}
          onChange={(e) => setSeason(e.target.value)}
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
          onChange={(e) => setTeamID(e.target.value)}
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
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={players}
            columns={columns}
            onRowClick={handleRowClick}
          />
        </div>
      </Box>
      {selectedPlayer && (
        <PlayerModal
          player={selectedPlayer}
          playerStats={playerStats}
          onClose={() => {
            setSelectedPlayer(null);
            setPlayerStats(null);
          }}
        />
      )}
    </Container>
  );
}

export default PlayerList;
