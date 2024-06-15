import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Tab,
  Tabs,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import RadarChart from "./RadarChart"; // Make sure to import RadarChart

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

  const rowHeight = 52;
  const regularSeasonHeight = playerStats
    ? (playerStats.seasonTotalsRegularSeason.length * rowHeight) + 80
    : 400;
  const postSeasonHeight = playerStats
    ? playerStats.seasonTotalsPostSeason.length * rowHeight
    : 400;

  const addIdToRows = (rows) =>
    rows.map((row, index) => ({ ...row, id: index }));

  const age =
    new Date().getFullYear() - new Date(player.birthdate).getFullYear();

  const topLevelStats = [
    { label: "PTS", value: player.pts },
    { label: "REB", value: player.reb },
    { label: "AST", value: player.ast },
    { label: "BLK", value: player.blk },
    { label: "STL", value: player.stl },
  ];

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Dialog open={Boolean(player)} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1, padding: "10px" }}>
          <h4>{player.playerName}</h4>
          <p>
            Position: {player.position}, Height: {player.height}, Age:{" "}
            {player.age}
          </p>
        </div>
        <div style={{ flex: 2, padding: "10px" }}>
          <h4>Overall Season Stats</h4>
          <p>
            {topLevelStats
              .map((stat) => ` ${stat.label}: ${stat.value}`)
              .toString()}
          </p>
        </div>
        <img
          src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.playerId}.png`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `${process.env.PUBLIC_URL}/KevinHartHeadshot.webp`;
          }}
          alt={`${player.playerName}'s headshot`}
          style={{ width: "150px", height: "auto", float: "right" }}
        />
      </DialogTitle>

      <DialogContent>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="season stats tabs"
        >
          {playerStats?.seasonTotalsRegularSeason?.length > 0 && (
            <Tab label="Regular Season" />
          )}
          {playerStats?.seasonTotalsPostSeason?.length > 0 && (
            <Tab label="Post Season" />
          )}
        </Tabs>
        {playerStats ? (
          tabValue === 0 ? (
            <div style={{ height: regularSeasonHeight, width: "100%" }}>
              <DataGrid
                rows={addIdToRows(playerStats.seasonTotalsRegularSeason)}
                columns={columns}
                autoHeight
                hideFooter
              />
            </div>
          ) : (
            tabValue === 1 && (
              <div style={{ height: postSeasonHeight, width: "100%" }}>
                <DataGrid
                  rows={addIdToRows(playerStats.seasonTotalsPostSeason)}
                  columns={columns}
                  autoHeight
                  hideFooter
                />
              </div>
            )
          )
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
        <div style={{ marginTop: 20 }}>
          {playerStats && <RadarChart />}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default PlayerModal;
