import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function PlayerModal({ player, playerStats, onClose }) {
  const columns = [
    { field: "seasonId", headerName: "Season", flex: 1, minWidth: 100 },
    { field: "teamAbbreviation", headerName: "Team", flex: 1, minWidth: 100 },
    { field: "gp", headerName: "GP", flex: 1, minWidth: 50 },
    { field: "gs", headerName: "GS", flex: 1, minWidth: 50 },
    { field: "min", headerName: "MIN", flex: 1, minWidth: 50 },
    { field: "fgm", headerName: "FGM", flex: 1, minWidth: 50 },
    { field: "fga", headerName: "FGA", flex: 1, minWidth: 50 },
    { field: "fgPct", headerName: "FG%", flex: 1, minWidth: 60 },
    { field: "fG3M", headerName: "3PM", flex: 1, minWidth: 50 },
    { field: "fG3A", headerName: "3PA", flex: 1, minWidth: 50 },
    { field: "fg3Pct", headerName: "3P%", flex: 1, minWidth: 60 },
    { field: "ftm", headerName: "FTM", flex: 1, minWidth: 50 },
    { field: "fta", headerName: "FTA", flex: 1, minWidth: 50 },
    { field: "ftPct", headerName: "FT%", flex: 1, minWidth: 60 },
    { field: "oreb", headerName: "OREB", flex: 1, minWidth: 60 },
    { field: "dreb", headerName: "DREB", flex: 1, minWidth: 50 },
    { field: "reb", headerName: "REB", flex: 1, minWidth: 50 },
    { field: "ast", headerName: "AST", flex: 1, minWidth: 50 },
    { field: "stl", headerName: "STL", flex: 1, minWidth: 50 },
    { field: "blk", headerName: "BLK", flex: 1, minWidth: 50 },
    { field: "tov", headerName: "TOV", flex: 1, minWidth: 50 },
    { field: "pf", headerName: "PF", flex: 1, minWidth: 50 },
    { field: "pts", headerName: "PTS", flex: 1, minWidth: 50 },
  ];

  const addIdToRows = (rows) =>
    rows.map((row, index) => ({ ...row, id: index }));

  return (
    <Dialog open={Boolean(player)} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{player.name}</DialogTitle>
      <DialogContent>
        <Typography>Team: {player.team}</Typography>
        <Typography>Position: {player.position}</Typography>

        {playerStats ? (
          <>
            <Typography variant="h6">Regular Season Stats</Typography>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={addIdToRows(playerStats.seasonTotalsRegularSeason)}
                columns={columns}
                autoHeight
                hideFooter
              />
            </div>

            {playerStats.seasonTotalsPostSeason?.length > 0 && (
              <>
                <Typography variant="h6" style={{ marginTop: 60 }}>
                  Post Season Stats
                </Typography>
                <div style={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={addIdToRows(playerStats.seasonTotalsPostSeason)}
                    columns={columns}
                    autoHeight
                    hideFooter
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 400,
            }}
          >
            <CircularProgress />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default PlayerModal;
