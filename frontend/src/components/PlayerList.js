import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Select, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import PlayerModal from './PlayerModal';

function PlayerList() {
  const [season, setSeason] = useState('2023-24');
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(`http://localhost:3001/players?season=${season}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
    fetchPlayers();
  }, [season]);

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          NBA Players
        </Typography>
        <Select
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          displayEmpty
          fullWidth
        >
          <MenuItem value="2023-24">2023-24</MenuItem>
          <MenuItem value="2022-23">2022-23</MenuItem>
          <MenuItem value="2021-22">2021-22</MenuItem>
          {/* Add more seasons as needed */}
        </Select>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Position</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id} onClick={() => setSelectedPlayer(player)}>
                <TableCell>{player.name}</TableCell>
                <TableCell>{player.team}</TableCell>
                <TableCell>{player.position}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      {selectedPlayer && (
        <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
      )}
    </Container>
  );
}

export default PlayerList;
