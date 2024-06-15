import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@mui/material';

const RadarChartComponent = ({ minutes, usage, selectedRows }) => {
  const [scaledStats, setScaledStats] = useState(null);

  useEffect(() => {
    const fetchScaledStats = async () => {
      try {
        const response = await fetch('http://localhost:3001/scale-stats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            minutes,
            usage,
            selectedRows,
            init: scaledStats == null
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setScaledStats(data.scaledStats || data.normalizedRows);
      } catch (error) {
        console.error('Error fetching scaled stats:', error);
      }
    };

    if (selectedRows.length > 0) {
      fetchScaledStats();
    }
  }, [minutes, usage, selectedRows]);

  const categories = ['PTS', 'TRB', 'trueShooting', 'assistToTurnover', 'stocks'];

  const data = categories.map(category => ({
    category,
    value: scaledStats && (scaledStats[category] || 0),
  }));

  return (
    <Card>
      <CardContent>
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
