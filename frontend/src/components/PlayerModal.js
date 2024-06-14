import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function PlayerModal({ player, playerStats, onClose }) {
  const columns = [
    { field: 'seasonId', headerName: 'Season', width: 100 },
    { field: 'teamAbbreviation', headerName: 'Team', width: 100 },
    { field: 'gp', headerName: 'GP', width: 50 },
    { field: 'gs', headerName: 'GS', width: 50 },
    { field: 'min', headerName: 'MIN', width: 50 },
    { field: 'fgm', headerName: 'FGM', width: 50 },
    { field: 'fga', headerName: 'FGA', width: 50 },
    { field: 'fgPct', headerName: 'FG%', width: 50 },
    { field: 'fG3M', headerName: '3PM', width: 50 },
    { field: 'fG3A', headerName: '3PA', width: 50 },
    { field: 'fg3Pct', headerName: '3P%', width: 50 },
    { field: 'ftm', headerName: 'FTM', width: 50 },
    { field: 'fta', headerName: 'FTA', width: 50 },
    { field: 'ftPct', headerName: 'FT%', width: 50 },
    { field: 'oreb', headerName: 'OREB', width: 50 },
    { field: 'dreb', headerName: 'DREB', width: 50 },
    { field: 'reb', headerName: 'REB', width: 50 },
    { field: 'ast', headerName: 'AST', width: 50 },
    { field: 'stl', headerName: 'STL', width: 50 },
    { field: 'blk', headerName: 'BLK', width: 50 },
    { field: 'tov', headerName: 'TOV', width: 50 },
    { field: 'pf', headerName: 'PF', width: 50 },
    { field: 'pts', headerName: 'PTS', width: 50 },
  ];

  const careerHighColumns = [
    { field: 'stat', headerName: 'Stat', width: 100 },
    { field: 'statValue', headerName: 'Value', width: 100 },
    { field: 'gameDate', headerName: 'Game Date', width: 150 },
    { field: 'vsTeamName', headerName: 'Opponent', width: 150 },
  ];

  const addIdToRows = (rows) => rows.map((row, index) => ({ ...row, id: index }));

  return playerStats.seasonTotalsRegularSeason && (
    <Dialog open={Boolean(player)} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{player.name}</DialogTitle>
      <DialogContent>
        <Typography>Team: {player.team}</Typography>
        <Typography>Position: {player.position}</Typography>

        <Typography variant="h6">Regular Season Stats</Typography>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={addIdToRows(playerStats.seasonTotalsRegularSeason)} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
        </div>

        {playerStats.seasonTotalsPostSeason?.length > 0 && (
          <>
            <Typography variant="h6" style={{ marginTop: 20 }}>Post Season Stats</Typography>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid rows={addIdToRows(playerStats.seasonTotalsPostSeason)} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default PlayerModal;
