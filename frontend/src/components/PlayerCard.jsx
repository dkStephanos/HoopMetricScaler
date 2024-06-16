import React from "react";
import { Card, CardContent, CardMedia, Typography, styled, useTheme } from "@mui/material";

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  textAlign: 'center',
}));

const ImageContainer = styled('div')(({ theme }) => ({
  height: '160px',
  overflow: 'hidden',
}));

const ImageStyle = styled(CardMedia)(({ theme }) => ({
  objectFit: 'contain',
  height: '100%',
  width: '100%',
}));

function PlayerCard({ player, onClick }) {
  const theme = useTheme();
  
  return (
    <Card onClick={() => onClick(player)}>
      <ImageContainer>
        <ImageStyle
          component="img"
          image={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.playerId}.png`}
          onError={(e) => { e.target.onerror = null; e.target.src = `${process.env.PUBLIC_URL}/KevinHartHeadshot.webp`; }}
          alt={`${player.playerName}'s headshot`}
        />
      </ImageContainer>
      <StyledCardContent>
        <Typography variant="h6">{player.playerName}</Typography>
      </StyledCardContent>
    </Card>
  );
}

export default PlayerCard;
