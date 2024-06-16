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
import { useTheme } from '@mui/material/styles';

const PlayerFilterBar = ({ season, teamID, handleSeasonChange, handleTeamChange }) => {
  const theme = useTheme();
  
  return (
    <Box sx={theme.custom.appBarPadding}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          🏀📈 HoopMetricScaler
          </Typography>
        </Toolbar>
      </AppBar>
      <p style={theme.custom.paddingLeft}>Browse historic/teams & players and estimate how their stats scale with more opportunity</p>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Select
            value={season}
            onChange={handleSeasonChange}
            displayEmpty
            fullWidth
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
