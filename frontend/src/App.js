import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Box, CircularProgress } from '@mui/material';

function App() {
  const [player, setPlayer] = useState(null);
  const [name, setName] = useState('Stephen Curry');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlayer = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/player/${name}`);
        if (!response.ok) {
          throw new Error('Player not found');
        }
        const data = await response.json();
        setPlayer(data);
      } catch (error) {
        setPlayer(null);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [name]);

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          NBA Player Stats!
        </Typography>
        <TextField
          label="Player Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <Box sx={{ my: 2 }}>
          <Button variant="contained" onClick={() => setName(name)}>
            Fetch Player
          </Button>
        </Box>
        {loading ? (
          <CircularProgress />
        ) : player ? (
          <Box>
            <Typography variant="h6">{player.commonPlayerInfo[0].displayFirstLast}</Typography>
            <Typography>Team: {player.commonPlayerInfo[0].teamName}</Typography>
            <Typography>Position: {player.commonPlayerInfo[0].position}</Typography>
          </Box>
        ) : (
          <Typography>No player data found</Typography>
        )}
      </Box>
    </Container>
  );
}

export default App;
