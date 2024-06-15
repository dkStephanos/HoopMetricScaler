import React from "react";
import {
  Container,
  Box,
  Typography,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from "@mui/material";
import PlayerModal from "./PlayerModal";
import TeamSummaryCard from "./TeamSummaryCard";
import { TEAMS, SEASONS } from "../constants";


function PlayerList({
  season,
  teamID,
  players,
  teamData,
  selectedPlayer,
  playerStats,
  handleSeasonChange,
  handleTeamChange,
  handleCardClick,
  handleCloseModal,
}) {
  return (
    <Container>
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
        <TeamSummaryCard teamSummary={teamData} />
        <Grid container spacing={2}>
          {players.map((player) => (
            <Grid item xs={12} sm={6} md={4} key={player.playerId}>
              <Card onClick={() => handleCardClick(player)}>
                <CardMedia
                  component="img"
                  height="140"
                  image={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.playerId}.png`}
                  alt={`${player.playerName}'s headshot`}
                />
                <CardContent>
                  <Typography variant="h6">{player.playerName}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Position: {player.position}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      {selectedPlayer && (
        <PlayerModal
          player={selectedPlayer}
          playerStats={playerStats}
          onClose={handleCloseModal}
        />
      )}
    </Container>
  );
}

export default PlayerList;
