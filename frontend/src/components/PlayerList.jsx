// PlayerList.js
import React from "react";
import {
  Container,
  Box,
  Typography,
  Select,
  MenuItem,
  Grid,
  Fade
} from "@mui/material";
import PlayerModal from "./PlayerModal";
import TeamSummaryCard from "./TeamSummaryCard";
import PlayerCard from "./PlayerCard";
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
        <Fade in={!!players?.length > 0} timeout={1000}>

        <Grid container spacing={2}>
          {players.map((player) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={player.playerId}>
              <PlayerCard player={player} onClick={handleCardClick} />
            </Grid>
          ))}
        </Grid>
        </Fade>

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
