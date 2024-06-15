import React, { useState, useEffect, useRef } from "react";
import { Grid, Fade } from "@mui/material";
import PlayerModal from "./PlayerModal";
import PlayerCard from "./PlayerCard";

function PlayerList({
  players,
  selectedPlayer,
  playerStats,
  handleCardClick,
  handleCloseModal,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect(); // Stop observing once it becomes visible
          }
        });
      },
      { threshold: 0.1 } // Adjust the threshold as needed
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

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
