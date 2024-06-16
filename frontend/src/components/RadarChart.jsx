import React, { useState, useEffect } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, Slider, Typography, Grow } from "@mui/material";
import { useIntersectionObserver } from "../hooks";
import { fetchScaledStats } from "../actions";

const CATEGORIES = [
  { name: "PTS", label: "Scoring" },
  { name: "TRB", label: "Rebounding" },
  { name: "trueShooting", label: "Shooting" },
  { name: "assistToTurnover", label: "Passing" },
  { name: "stocks", label: "Defense" },
];

const RadarChartComponent = ({
  minutes,
  usage,
  selectedRows,
  handleSliderChange,
  isModalOpen,
}) => {
  const { isVisible, containerRef, resetVisibility } = useIntersectionObserver(0.1);
  const [scaledStats, setScaledStats] = useState(null);

  const fetchData = async () => {
    if (selectedRows.length) {
      let data = await fetchScaledStats(
        minutes,
        usage,
        selectedRows,
        scaledStats == null
      );
      for (const key in data) {
        if (data[key] === null) {
          data[key] = 0;
        }
      }
      setScaledStats(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, [minutes, usage, selectedRows]);

  useEffect(() => {
    if (!isModalOpen) {
      resetVisibility();
    }
  }, [isModalOpen]);

  const handleMinutesChange = (event, newValue) => {
    handleSliderChange(event, newValue, "minutes");
  };

  const handleUsageChange = (event, newValue) => {
    handleSliderChange(event, newValue, "usage");
  };

  return (
    <Grow in={!!scaledStats} timeout={1000}>
      <div style={{ marginTop: 20 }}>
        <Card>
          <CardContent>
            <h5>
              Select rows from the table above to update the chart. The sliders
              below will augment expected value based on historic trends.
            </h5>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ width: "45%" }}>
                <Typography gutterBottom>Minutes Played</Typography>
                <Slider
                  value={minutes}
                  onChange={handleMinutesChange}
                  aria-labelledby="minutes-slider"
                  min={0}
                  max={48}
                  step={1}
                  valueLabelDisplay="auto"
                />
              </div>
              <div style={{ width: "45%" }}>
                <Typography gutterBottom>Usage Rate</Typography>
                <Slider
                  value={usage}
                  onChange={handleUsageChange}
                  aria-labelledby="usage-slider"
                  min={0}
                  max={1}
                  step={0.01}
                  valueLabelDisplay="auto"
                />
              </div>
            </div>
            <div ref={containerRef}>
              {scaledStats && isVisible ? (
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart
                    data={CATEGORIES.map((category) => ({
                      category: category.label,
                      value: scaledStats ? scaledStats[category.name] : 0,
                    }))}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis domain={[0, 1]} />
                    <Radar
                      name="Player Stats"
                      dataKey="value"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Grow>
  );
};

export default RadarChartComponent;
