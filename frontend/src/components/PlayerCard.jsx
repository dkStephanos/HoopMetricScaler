import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

function PlayerCard({ player, onClick }) {
  return (
    <Card onClick={() => onClick(player)}>
      <div style={{ height: '160px', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.playerId}.png`}
          alt={`${player.playerName}'s headshot`}
          style={{ objectFit: 'contain', height: '100%', width: '100%' }}
        />
      </div>
      <CardContent style={{ textAlign: 'center' }}>
        <Typography variant="h6">{player.playerName}</Typography>
      </CardContent>
    </Card>
  );
}

export default PlayerCard;
