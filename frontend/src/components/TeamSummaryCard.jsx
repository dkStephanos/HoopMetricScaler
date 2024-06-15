import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";

function TeamSummaryCard({ teamSummary }) {
  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        {teamSummary ? (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h5">{teamSummary.teamName}</Typography>
                <Typography variant="subtitle1">
                  {teamSummary.groupValue}
                </Typography>
                <Typography variant="body2">
                  Games Played: {teamSummary.gp}
                </Typography>
                <Typography variant="body2">Wins: {teamSummary.w}</Typography>
                <Typography variant="body2">Losses: {teamSummary.l}</Typography>
                <Typography variant="body2">
                  Win %: {teamSummary.wPct}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <img
                  src={`https://cdn.nba.com/logos/nba/${teamSummary.teamId}/primary/L/logo.svg`}
                  alt={`${teamSummary.teamName} logo`}
                  style={{ width: "100%", maxWidth: "150px", float: "right" }}
                />
              </Grid>
            </Grid>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Points</TableCell>
                    <TableCell>{teamSummary.pts}</TableCell>
                    <TableCell>Minutes</TableCell>
                    <TableCell>{teamSummary.min}</TableCell>
                    <TableCell>Field Goals Made</TableCell>
                    <TableCell>{teamSummary.fgm}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Field Goals Attempted</TableCell>
                    <TableCell>{teamSummary.fga}</TableCell>
                    <TableCell>Field Goal %</TableCell>
                    <TableCell>{teamSummary.fgPct}</TableCell>
                    <TableCell>3PM</TableCell>
                    <TableCell>{teamSummary.fG3M}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>3PA</TableCell>
                    <TableCell>{teamSummary.fG3A}</TableCell>
                    <TableCell>3P%</TableCell>
                    <TableCell>{teamSummary.fg3Pct}</TableCell>
                    <TableCell>FTM</TableCell>
                    <TableCell>{teamSummary.ftm}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>FTA</TableCell>
                    <TableCell>{teamSummary.fta}</TableCell>
                    <TableCell>FT%</TableCell>
                    <TableCell>{teamSummary.ftPct}</TableCell>
                    <TableCell>Offensive Rebounds</TableCell>
                    <TableCell>{teamSummary.oreb}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Defensive Rebounds</TableCell>
                    <TableCell>{teamSummary.dreb}</TableCell>
                    <TableCell>Total Rebounds</TableCell>
                    <TableCell>{teamSummary.reb}</TableCell>
                    <TableCell>Assists</TableCell>
                    <TableCell>{teamSummary.ast}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Turnovers</TableCell>
                    <TableCell>{teamSummary.tov}</TableCell>
                    <TableCell>Steals</TableCell>
                    <TableCell>{teamSummary.stl}</TableCell>
                    <TableCell>Blocks</TableCell>
                    <TableCell>{teamSummary.blk}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Blocked Shots Against</TableCell>
                    <TableCell>{teamSummary.blka}</TableCell>
                    <TableCell>Personal Fouls</TableCell>
                    <TableCell>{teamSummary.pf}</TableCell>
                    <TableCell>Personal Fouls Drawn</TableCell>
                    <TableCell>{teamSummary.pfd}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Plus/Minus</TableCell>
                    <TableCell>{teamSummary.plusMinus}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <>
            <Typography>Loading team summary...</Typography>
            <CircularProgress />
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default TeamSummaryCard;
