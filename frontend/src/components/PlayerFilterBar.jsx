import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  Box,
  Grid
} from "@mui/material";
import { TEAMS, SEASONS } from "../constants";

const PlayerFilterBar = ({ season, teamID, handleSeasonChange, handleTeamChange }) => {
  return (
    <Box sx={{ my: 4 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            NBA Players
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6}>
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
        </Grid>
        <Grid item xs={6}>
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlayerFilterBar;
