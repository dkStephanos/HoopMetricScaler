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
  Grow,
  useTheme,
} from "@mui/material";

function TeamSummaryCard({ teamSummary }) {
  const theme = useTheme();

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        {teamSummary ? (
          <Grow in={Boolean(teamSummary)} timeout={1000}>
            <div>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h5">
                    {teamSummary.teamName} - <i>{teamSummary.groupValue}</i>
                  </Typography>
                  <div style={theme.custom.paddingLeft}>
                    <Typography variant="body1">
                      Games Played: <i>{teamSummary.gp}</i>
                    </Typography>
                    <Typography variant="body1">
                      Wins: <i>{teamSummary.w}</i>
                    </Typography>
                    <Typography variant="body1">
                      Losses: <i>{teamSummary.l}</i>
                    </Typography>
                    <Typography variant="body1">
                      Win %: <i>{teamSummary.wPct}</i>
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <img
                    src={`https://cdn.nba.com/logos/nba/${teamSummary.teamId}/primary/L/logo.svg`}
                    alt={`${teamSummary.teamName} logo`}
                    style={{ width: "100%", maxWidth: "150px", float: "right" }}
                  />
                </Grid>
              </Grid>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Points</TableCell>
                      <TableCell>{teamSummary.pts}</TableCell>
                      <TableCell>Points Allowed</TableCell>
                      <TableCell>
                        {teamSummary.pts - teamSummary.plusMinus}
                      </TableCell>
                      <TableCell>Plus/Minus</TableCell>
                      <TableCell>{teamSummary.plusMinus}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Field Goals Made</TableCell>
                      <TableCell>{teamSummary.fgm}</TableCell>
                      <TableCell>Field Goals Attempted</TableCell>
                      <TableCell>{teamSummary.fga}</TableCell>
                      <TableCell>Field Goal %</TableCell>
                      <TableCell>{teamSummary.fgPct}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>3PM</TableCell>
                      <TableCell>{teamSummary.fG3M}</TableCell>
                      <TableCell>3PA</TableCell>
                      <TableCell>{teamSummary.fG3A}</TableCell>
                      <TableCell>3P%</TableCell>
                      <TableCell>{teamSummary.fg3Pct}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>FTM</TableCell>
                      <TableCell>{teamSummary.ftm}</TableCell>
                      <TableCell>FTA</TableCell>
                      <TableCell>{teamSummary.fta}</TableCell>
                      <TableCell>FT%</TableCell>
                      <TableCell>{teamSummary.ftPct}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Offensive Rebounds</TableCell>
                      <TableCell>{teamSummary.oreb}</TableCell>
                      <TableCell>Defensive Rebounds</TableCell>
                      <TableCell>{teamSummary.dreb}</TableCell>
                      <TableCell>Total Rebounds</TableCell>
                      <TableCell>{teamSummary.reb}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Assists</TableCell>
                      <TableCell>{teamSummary.ast}</TableCell>
                      <TableCell>Steals</TableCell>
                      <TableCell>{teamSummary.stl}</TableCell>
                      <TableCell>Blocks</TableCell>
                      <TableCell>{teamSummary.blk}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Turnovers</TableCell>
                      <TableCell>{teamSummary.tov}</TableCell>
                      <TableCell>Personal Fouls</TableCell>
                      <TableCell>{teamSummary.pf}</TableCell>
                      <TableCell>Personal Fouls Drawn</TableCell>
                      <TableCell>{teamSummary.pfd}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Grow>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: 400,
            }}
          >
            <Typography>Loading team summary...</Typography>
            <CircularProgress />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TeamSummaryCard;
