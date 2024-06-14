import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

function PlayerModal({ player, playerStats, onClose }) {
  const renderTable = (stats) => (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Season</TableCell>
          <TableCell>Team</TableCell>
          <TableCell>GP</TableCell>
          <TableCell>GS</TableCell>
          <TableCell>MIN</TableCell>
          <TableCell>FGM</TableCell>
          <TableCell>FGA</TableCell>
          <TableCell>FG%</TableCell>
          <TableCell>3PM</TableCell>
          <TableCell>3PA</TableCell>
          <TableCell>3P%</TableCell>
          <TableCell>FTM</TableCell>
          <TableCell>FTA</TableCell>
          <TableCell>FT%</TableCell>
          <TableCell>OREB</TableCell>
          <TableCell>DREB</TableCell>
          <TableCell>REB</TableCell>
          <TableCell>AST</TableCell>
          <TableCell>STL</TableCell>
          <TableCell>BLK</TableCell>
          <TableCell>TOV</TableCell>
          <TableCell>PF</TableCell>
          <TableCell>PTS</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {stats.map((season) => (
          <TableRow key={season.seasonId}>
            <TableCell>{season.seasonId}</TableCell>
            <TableCell>{season.teamAbbreviation}</TableCell>
            <TableCell>{season.gp}</TableCell>
            <TableCell>{season.gs}</TableCell>
            <TableCell>{season.min}</TableCell>
            <TableCell>{season.fgm}</TableCell>
            <TableCell>{season.fga}</TableCell>
            <TableCell>{season.fgPct}</TableCell>
            <TableCell>{season.fG3M}</TableCell>
            <TableCell>{season.fG3A}</TableCell>
            <TableCell>{season.fg3Pct}</TableCell>
            <TableCell>{season.ftm}</TableCell>
            <TableCell>{season.fta}</TableCell>
            <TableCell>{season.ftPct}</TableCell>
            <TableCell>{season.oreb}</TableCell>
            <TableCell>{season.dreb}</TableCell>
            <TableCell>{season.reb}</TableCell>
            <TableCell>{season.ast}</TableCell>
            <TableCell>{season.stl}</TableCell>
            <TableCell>{season.blk}</TableCell>
            <TableCell>{season.tov}</TableCell>
            <TableCell>{season.pf}</TableCell>
            <TableCell>{season.pts}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return playerStats && (
    <Dialog open={Boolean(player)} onClose={onClose}>
      <DialogTitle>{player.name}</DialogTitle>
      <DialogContent>
        <Typography>Team: {player.team}</Typography>
        <Typography>Position: {player.position}</Typography>

        <Typography variant="h6">Regular Season Stats</Typography>
        {renderTable(playerStats.seasonTotalsRegularSeason)}

        {playerStats.seasonTotalsPostSeason.length > 0 && (
          <>
            <Typography variant="h6">Post Season Stats</Typography>
            {renderTable(playerStats.seasonTotalsPostSeason)}
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
