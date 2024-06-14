import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Select, MenuItem, Card, CardContent, CardMedia, Grid } from "@mui/material";
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

  const handleCardClick = async (player) => {
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
        <Grid container spacing={2}>
          {players.map((player) => (
            <Grid item xs={12} sm={6} md={4} key={player.id}>
              <Card onClick={() => handleCardClick(player)}>
                <CardMedia
                  component="img"
                  height="140"
                  image={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.id}.png`}
                  alt={`${player.name}'s headshot`}
                />
                <CardContent>
                  <Typography variant="h6">{player.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Position: {player.position}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      {selectedPlayer && playerStats && (
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
