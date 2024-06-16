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

const centeredColumn = {
  headerAlign: 'center',
  align: 'center',
};

const COLUMNS = [
  { field: "seasonId", headerName: "Season", flex: 1, minWidth: 80 },
  { field: "teamAbbreviation", headerName: "Team", flex: 1, minWidth: 60 },
  { field: "gp", headerName: "GP", flex: 1, minWidth: 40, ...centeredColumn },
  { field: "min", headerName: "MIN", flex: 1, minWidth: 50, ...centeredColumn },
  { field: "pts", headerName: "PTS", flex: 1, minWidth: 50, ...centeredColumn },
  { field: "reb", headerName: "REB", flex: 1, minWidth: 50, ...centeredColumn },
  { field: "ast", headerName: "AST", flex: 1, minWidth: 50, ...centeredColumn },
  { field: "stl", headerName: "STL", flex: 1, minWidth: 50, ...centeredColumn },
  { field: "blk", headerName: "BLK", flex: 1, minWidth: 50, ...centeredColumn },
  { field: "fgPct", headerName: "FG%", flex: 1, minWidth: 60, ...centeredColumn },
  { field: "fg3Pct", headerName: "3P%", flex: 1, minWidth: 60, ...centeredColumn },
  { field: "ftPct", headerName: "FT%", flex: 1, minWidth: 60, ...centeredColumn },
  { field: "tov", headerName: "TOV", flex: 1, minWidth: 50, ...centeredColumn },
  { field: "pf", headerName: "PF", flex: 1, minWidth: 50, ...centeredColumn },
  { field: "fgm", headerName: "FGM", flex: 1, minWidth: 50, ...centeredColumn },
  { field: "fga", headerName: "FGA", flex: 1, minWidth: 50, ...centeredColumn },
  { field: "fG3M", headerName: "3PM", flex: 1, minWidth: 50, ...centeredColumn },
  { field: "fG3A", headerName: "3PA", flex: 1, minWidth: 50, ...centeredColumn },
  { field: "ftm", headerName: "FTM", flex: 1, minWidth: 50, ...centeredColumn },
  { field: "fta", headerName: "FTA", flex: 1, minWidth: 50, ...centeredColumn },
  { field: "oreb", headerName: "OREB", flex: 1, minWidth: 60, ...centeredColumn },
  { field: "dreb", headerName: "DREB", flex: 1, minWidth: 60, ...centeredColumn },
  { field: "gs", headerName: "GS", flex: 1, minWidth: 40, ...centeredColumn },
];

function PlayerModal({ player, playerStats, onClose }) {
  const [tabValue, setTabValue] = useState(0);
  const [selectedRows, setSelectedRows] = useState(null);
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
    <Dialog open={Boolean(player)} onClose={onClose} maxWidth="xlg" fullWidth>
      <DialogTitle>
        <Paper
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 2.5, padding: "10px" }}>
          <img
            src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.playerId}.png`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `${process.env.PUBLIC_URL}/KevinHartHeadshot.webp`;
            }}
            alt={`${player.playerName}'s headshot`}
            style={{ width: "150px", height: "auto", float: "left" }}
          />
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
          <div style={{ flex: 2, padding: "10px", float: "right" }}>
            <h3>Overall Season Stats</h3>
            <p>
              {topLevelStats
                .map((stat) => ` ${stat.label}: ${stat.value}`)
                .toString()}
            </p>
          </div>
        </Paper>
      </DialogTitle>
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
      <DialogContent style={{ display: "flex", height: "80vh", padding: 0 }}>
  <div
    style={{
      marginLeft: "30px",
      width: "50%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    }}
  >
    <Grow
      in={!!selectedRowIds}
      timeout={{ enter: 300, exit: 200 }}
      easing={{ enter: 'cubic-bezier(0.4, 0, 0.2, 1)', exit: 'cubic-bezier(0.4, 0, 0.6, 1)' }}
    >
      <div style={{ width: "100%", height: "100%" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="season stats tabs"
          variant="fullWidth"
          sx={{
            width: "100%",
            backgroundColor: "background.paper",
          }}
        >
          {regularSeasonRows?.length > 0 && <Tab label="Regular Season" />}
          {postSeasonRows?.length > 0 && <Tab label="Post Season" />}
        </Tabs>
        {!!selectedRowIds &&
          (tabValue === 0 ? (
            <DataGrid
              rows={regularSeasonRows}
              columns={COLUMNS}
              autoHeight={false}
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
              sx={{ height: "calc(100% - 48px)", overflowY: "auto" }} // Adjusted height to account for the tab height
            />
          ) : (
            tabValue === 1 && (
              <DataGrid
                rows={postSeasonRows}
                columns={COLUMNS}
                autoHeight={false}
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
                sx={{ height: "calc(100% - 48px)", overflowY: "auto" }} // Adjusted height to account for the tab height
              />
            )
          ))}
      </div>
    </Grow>
  </div>
  <div
    style={{
      width: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "0 20px 0 20px"
    }}
  >
    <RadarChart selectedRows={selectedRows} />
  </div>
</DialogContent>


      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default PlayerModal;
