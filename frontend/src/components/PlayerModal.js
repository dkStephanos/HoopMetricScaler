import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

function PlayerModal({ player, onClose }) {
  return (
    <Dialog open={Boolean(player)} onClose={onClose}>
      <DialogTitle>{player.name}</DialogTitle>
      <DialogContent>
        <Typography>Team: {player.team}</Typography>
        <Typography>Position: {player.position}</Typography>
        <Typography>Points: {player.points}</Typography>
        <Typography>Assists: {player.assists}</Typography>
        <Typography>Rebounds: {player.rebounds}</Typography>
        {/* Add more player info as needed */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default PlayerModal;
