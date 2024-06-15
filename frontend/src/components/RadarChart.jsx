import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Typography, Slider, Card, CardContent } from '@mui/material';

const RadarChartComponent = () => {
  const [scaledStats, setScaledStats] = useState({});
  const [minutes, setMinutes] = useState(30);
  const [usage, setUsage] = useState(20);

  const fetchScaledStats = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/scale-stats?mp=${minutes}&usg=${usage}`);
      setScaledStats(response.data);
    } catch (error) {
      console.error('Error fetching scaled stats:', error);
    }
  };

  useEffect(() => {
    fetchScaledStats();
  }, [minutes, usage]);

  const categories = ['PTS', 'TRB', 'AST', 'STL', 'BLK', 'TOV'];

  const data = categories.map(category => ({
    category,
    value: scaledStats[category] || 0,
  }));

  return (
    <Card>
      <CardContent>
        <Box>
          <Typography>Minutes Played</Typography>
          <Slider
            value={minutes}
            onChange={(e, newValue) => setMinutes(newValue)}
            aria-labelledby="continuous-slider"
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={48}
          />
          <Typography>Usage Rate</Typography>
          <Slider
            value={usage}
            onChange={(e, newValue) => setUsage(newValue)}
            aria-labelledby="continuous-slider"
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={100}
          />
        </Box>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <PolarRadiusAxis />
            <Radar name="Player Stats" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RadarChartComponent;
