import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grow,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import RadarChart from "./RadarChart";

const COLUMNS = [
  { field: "seasonId", headerName: "Season", flex: 1, minWidth: 100 },
  { field: "teamAbbreviation", headerName: "Team", flex: 1, minWidth: 100 },
  { field: "gp", headerName: "GP", flex: 1, minWidth: 50 },
  { field: "gs", headerName: "GS", flex: 1, minWidth: 50 },
  { field: "min", headerName: "MIN", flex: 1, minWidth: 50 },
  { field: "pts", headerName: "PTS", flex: 1, minWidth: 50 },
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
];

function PlayerModal({ player, playerStats, onClose, isModalOpen }) {
  const [tabValue, setTabValue] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowIds, setSelectedIds] = useState(null);
  const [regularSeasonRows, setRegularSeasonRows] = useState([]);
  const [postSeasonRows, setPostSeasonRows] = useState([]);

  const addIdToRows = (rows, type) =>
    rows.map((row, index) => ({ ...row, id: `${index}-${type}`, type }));

  const topLevelStats = [
    {
      label: "PIE",
      value: playerStats ? playerStats.playerHeadlineStats[0].pie : "-",
    },
    {
      label: "PTS",
      value: playerStats ? playerStats.playerHeadlineStats[0].pts : "-",
    },
    {
      label: "REB",
      value: playerStats ? playerStats.playerHeadlineStats[0].reb : "-",
    },
    {
      label: "AST",
      value: playerStats ? playerStats.playerHeadlineStats[0].ast : "-",
    },
  ];

  useEffect(() => {
    if (playerStats) {
      // Sort rows by seasonId in descending order
      const sortedRegularRows = addIdToRows(
        playerStats.seasonTotalsRegularSeason,
        "regular"
      ).sort((a, b) => b.seasonId.localeCompare(a.seasonId));
      const sortedPlayoffRows = addIdToRows(
        playerStats.seasonTotalsPostSeason,
        "playoff"
      ).sort((a, b) => b.seasonId.localeCompare(a.seasonId));

      const initialSelectedRows = [
        ...(sortedRegularRows.length > 0 ? [sortedRegularRows[0]] : []),
        ...(sortedPlayoffRows.length > 0 ? [sortedPlayoffRows[0]] : []),
      ];

      setSelectedRows(initialSelectedRows);
      setSelectedIds(initialSelectedRows.map((row) => row.id));
      setRegularSeasonRows(sortedRegularRows);
      setPostSeasonRows(sortedPlayoffRows);
    }
  }, [playerStats]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSelectionChange = (rowIndices, type) => {
    const rowIndexSet = new Set(rowIndices);
    const selectedRowData =
      type === "regular"
        ? regularSeasonRows.filter((row) => rowIndexSet.has(row.id))
        : postSeasonRows.filter((row) => rowIndexSet.has(row.id));
    
    setSelectedRows((prev) => {
      const otherType = type === "regular" ? "playoff" : "regular";
      const otherSelectedRows = prev.filter((row) => row.type === otherType);
      return [...otherSelectedRows, ...selectedRowData];
    });
    
    setSelectedIds((prev) => {
      const otherTypeIds = prev.filter((id) => !id.includes(type));
      return [...otherTypeIds, ...Array.from(rowIndexSet)];
    });
  };

  return (
    <Dialog open={Boolean(player)} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Paper
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, padding: "10px" }}>
            <h3>
              {player.playerName}:{" "}
              <i>
                {playerStats ? playerStats.commonPlayerInfo[0].position : "-"}
              </i>
            </h3>
            <p>
              Height:{" "}
              {playerStats ? playerStats.commonPlayerInfo[0].height : "-"},
              Weight:{" "}
              {playerStats ? playerStats.commonPlayerInfo[0].weight : "-"}
            </p>
          </div>
          <div style={{ flex: 2, padding: "10px" }}>
            <h3>Overall Season Stats</h3>
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
        </Paper>
      </DialogTitle>
      <DialogContent>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="season stats tabs"
        >
          {regularSeasonRows?.length > 0 && <Tab label="Regular Season" />}
          {postSeasonRows?.length > 0 && <Tab label="Post Season" />}
        </Tabs>
        {selectedRowIds == null && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: 400,
            }}
          >
            <Typography>Loading player stats...</Typography>
            <CircularProgress />
          </div>
        )}
        <Grow in={!!selectedRowIds} timeout={1000}>
          <div>
            {!!selectedRowIds &&
              (tabValue === 0 ? (
                <DataGrid
                  rows={regularSeasonRows}
                  columns={COLUMNS}
                  autoHeight
                  hideFooter
                  checkboxSelection
                  rowSelectionModel={selectedRowIds.filter((id) =>
                    id.includes("regular")
                  )}
                  onRowSelectionModelChange={(ids) =>
                    handleSelectionChange(ids, "regular")
                  }
                  initialState={{
                    sorting: {
                      sortModel: [{ field: "seasonId", sort: "desc" }],
                    },
                  }}
                />
              ) : (
                tabValue === 1 && (
                  <DataGrid
                    rows={postSeasonRows}
                    columns={COLUMNS}
                    autoHeight
                    hideFooter
                    checkboxSelection
                    rowSelectionModel={selectedRowIds.filter((id) =>
                      id.includes("playoff")
                    )}
                    onRowSelectionModelChange={(ids) =>
                      handleSelectionChange(ids, "playoff")
                    }
                    initialState={{
                      sorting: {
                        sortModel: [{ field: "seasonId", sort: "desc" }],
                      },
                    }}
                  />
                )
              ))}
          </div>
        </Grow>
        <RadarChart selectedRows={selectedRows} isModalOpen={isModalOpen} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default PlayerModal;
