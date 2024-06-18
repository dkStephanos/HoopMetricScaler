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
import {
  Card,
  CardContent,
  Slider,
  Typography,
  Grow,
  useTheme,
} from "@mui/material";
import { fetchScaledStats } from "../actions";

const CATEGORIES = [
  { name: "PTS", label: "Scoring" },
  { name: "TRB", label: "Rebounding" },
  { name: "trueShooting", label: "Shooting" },
  { name: "assistToTurnover", label: "Passing" },
  { name: "stocks", label: "Defense" },
];

const RadarChartComponent = ({ selectedRows }) => {
  const theme = useTheme();
  const [scaledStats, setScaledStats] = useState(null);
  const [sliderValue, setSliderValue] = useState({ minutes: null, usage: null });

  useEffect(() => {
    if (selectedRows?.length > 0) {
      fetchData(true);
    } else {
      setScaledStats(null);
      setSliderValue({ minutes: null, usage: null });
    }
  }, [selectedRows]);

  const fetchData = async (init = false) => {
    let data = await fetchScaledStats(
      sliderValue.minutes,
      sliderValue.usage,
      selectedRows,
      init || scaledStats == null
    );
    for (const key in data) {
      if (data[key] === null) {
        data[key] = 0;
      }
    }
    setSliderValue({ minutes: data.minutesPlayed, usage: data.usage });
    setScaledStats(data);
  };

  const handleSliderChange = (type) => (_, value) => {
    setSliderValue((prev) => ({ ...prev, [type]: value }));
  };

  return (
    <Grow in={selectedRows} timeout={1000}>
      <Card>
        <CardContent>
          <h5>
            Select rows from the tables above to update the chart. The sliders
            below will augment expected value based on historic trends.
          </h5>
          <div style={theme.custom.sliderContainer}>
            <div style={theme.custom.sliderItem}>
              <Typography gutterBottom>Minutes Played</Typography>
              <Slider
                value={sliderValue.minutes}
                disabled={sliderValue.minutes == null}
                onChange={handleSliderChange("minutes")}
                onChangeCommitted={() => fetchData()}
                aria-labelledby="minutes-slider"
                min={0}
                max={48}
                step={1}
                valueLabelDisplay="auto"
              />
            </div>
            <div style={theme.custom.sliderItem}>
              <Typography gutterBottom>Usage Rate</Typography>
              <Slider
                value={sliderValue.usage}
                disabled={sliderValue.usage == null}
                onChange={handleSliderChange("usage")}
                onChangeCommitted={() => fetchData()}
                aria-labelledby="usage-slider"
                min={0}
                max={1}
                step={0.01}
                valueLabelDisplay="auto"
              />
            </div>
          </div>
          {selectedRows != null ? (
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart
                data={CATEGORIES.map((category) => ({
                  category: category.label,
                  value: scaledStats ? scaledStats[category.name] : 0,
                }))}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={55} domain={[0, 1]} />
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
        </CardContent>
      </Card>
    </Grow>
  );
};

export default RadarChartComponent;
