import React from "react";
import { Grid, Fade } from "@mui/material";
import PlayerModal from "./PlayerModal";
import PlayerCard from "./PlayerCard";
import { useIntersectionObserver } from "../hooks";

function PlayerList({
  players,
  selectedPlayer,
  playerStats,
  handleCardClick,
  handleCloseModal,
}) {
  const { isVisible, containerRef } = useIntersectionObserver(0.1);

  return (
    <>
      <div ref={containerRef}>
        <Fade in={isVisible} timeout={1000}>
          <Grid container spacing={2}>
            {players.map((player) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={player.playerId}>
                <PlayerCard player={player} onClick={handleCardClick} />
              </Grid>
            ))}
          </Grid>
        </Fade>
      </div>

      {selectedPlayer && (
        <PlayerModal
          player={selectedPlayer}
          playerStats={playerStats}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

export default PlayerList;
