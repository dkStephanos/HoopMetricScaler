const fs = require("fs");
const csv = require("csv-parser");
const regression = require("regression");
const logger = require("./logger");

function loadBoxScores() {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream("./data/boxscore.csv")
      .pipe(csv())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        resolve(data);
      })
      .on("error", reject);
  });
}

function estimateUsageRate(playerStats) {
  const usageRate =
    (playerStats.FGA + 0.44 * playerStats.FTA + playerStats.TOV) /
    playerStats.MP;
  return usageRate;
}

function aggregateData(data) {
  const aggregatedData = {};

  data.forEach((row) => {
    if (!aggregatedData[row.player_name]) {
      aggregatedData[row.player_name] = {
        MP: 0,
        FGA: 0,
        FTA: 0,
        TOV: 0,
        PTS: 0,
        TRB: 0,
        AST: 0,
        STL: 0,
        BLK: 0,
        PF: 0,
        "+/-": 0,
        games: 0,
      };
    }
    aggregatedData[row.player_name].MP += parseFloat(row.MP);
    aggregatedData[row.player_name].FGA += parseFloat(row.FGA);
    aggregatedData[row.player_name].FTA += parseFloat(row.FTA);
    aggregatedData[row.player_name].TOV += parseFloat(row.TOV);
    aggregatedData[row.player_name].PTS += parseFloat(row.PTS);
    aggregatedData[row.player_name].TRB += parseFloat(row.TRB);
    aggregatedData[row.player_name].AST += parseFloat(row.AST);
    aggregatedData[row.player_name].STL += parseFloat(row.STL);
    aggregatedData[row.player_name].BLK += parseFloat(row.BLK);
    aggregatedData[row.player_name].PF += parseFloat(row.PF);
    aggregatedData[row.player_name]["+/-"] += parseFloat(row["+/-"]);
    aggregatedData[row.player_name].games += 1;
  });

  Object.keys(aggregatedData).forEach((player) => {
    Object.keys(aggregatedData[player]).forEach((key) => {
      if (key !== "games") {
        aggregatedData[player][key] /= aggregatedData[player].games;
      }
    });
    aggregatedData[player].usage = estimateUsageRate(aggregatedData[player]);
    aggregatedData[player].trueShooting =
      aggregatedData[player].PTS /
      (2 * (aggregatedData[player].FGA + 0.44 * aggregatedData[player].FTA));
    aggregatedData[player].assistToTurnover =
      aggregatedData[player].AST / aggregatedData[player].TOV;
    aggregatedData[player].stocks =
      aggregatedData[player].STL + aggregatedData[player].BLK;
  });

  return aggregatedData;
}

function normalizeData(data) {
  const normalizedData = {};
  const stats = [
    "PTS",
    "+/-",
    "TRB",
    "trueShooting",
    "assistToTurnover",
    "stocks",
  ];
  const minMax = {};

  stats.forEach((stat) => {
    const values = Object.values(data).map((player) => player[stat]);
    minMax[stat] = { min: Math.min(...values), max: Math.max(...values) };
  });

  Object.keys(data).forEach((player) => {
    normalizedData[player] = {};
    stats.forEach((stat) => {
      normalizedData[player][stat] =
        (data[player][stat] - minMax[stat].min) /
        (minMax[stat].max - minMax[stat].min);
    });
  });

  return normalizedData;
}

function trainModel(data) {
  const features = data.map((row) => [row.minutes, row.usage]);
  const labels = data.map((row) => [
    row.PTS,
    row["+/-"],
    row.TRB,
    row.trueShooting,
    row.assistToTurnover,
    row.stocks,
  ]);
  const result = regression.linear(features.map((f, i) => [f[0], labels[i]]));
  return result;
}

async function initializeModel() {
  try {
    logger.info("Starting model initialization");

    // Load box scores from CSV
    logger.info("Loading box scores...");
    const boxScores = await loadBoxScores();
    const cleanedBoxScores = boxScores.filter(
      (row) =>
        !Object.values(row).some(
          (value) =>
            value === "NaN" ||
            value === null ||
            value === "" ||
            value === "Did Not Play" ||
            value === "Did Not Dress" ||
            value === "Not With Team"
        )
    );
    logger.info(`Loaded ${cleanedBoxScores.length} box scores`);

    // Calculate additional metrics before aggregation
    logger.info("Calculating additional metrics...");
    const enrichedBoxScores = cleanedBoxScores.map(row => {
      const trueShooting = ((+row.PTS) / (2 * (+row.FGA + 0.44 * +row.FTA))) || 0;
      const assistToTurnover = (+row.AST / +row.TOV) || 0;
      const stocks = (+row.STL + +row.BLK) || 0;
      const minutesPlayed = parseFloat(row.MP.split(':')[0]) + parseFloat(row.MP.split(':')[1]) / 60;
      const usage = ((+row.FGA + 0.44 * +row.FTA + +row.TOV) / minutesPlayed) || 0;
      return {
        ...row,
        trueShooting: isFinite(trueShooting) ? trueShooting : 0,
        assistToTurnover: isFinite(assistToTurnover) ? assistToTurnover : 0,
        stocks,
        minutesPlayed,
        usage,
        PTS: +row.PTS,
        '+/-': +row['+/-'],  // Ensure plus/minus is treated as a number
        TRB: +row.TRB
      };
    });

    // Remove unnecessary columns
    const necessaryColumns = ['player_name', 'PTS', '+/-', 'TRB', 'trueShooting', 'assistToTurnover', 'stocks', 'minutesPlayed', 'usage'];
    const reducedBoxScores = enrichedBoxScores.map(row => {
      const reducedRow = {};
      necessaryColumns.forEach(col => {
        reducedRow[col] = row[col];
      });
      return reducedRow;
    });

    // Write cleaned and reduced box scores to CSV with headers
    const reducedHeaders = necessaryColumns.join(",");
    fs.writeFileSync(
      "./data/cleaned_boxscore.csv",
      reducedHeaders + "\n" + reducedBoxScores.map((e) => Object.values(e).join(",")).join("\n")
    );
    logger.info("Cleaned and reduced box scores written to ./data/cleaned_boxscore.csv");

    // Aggregate data
    logger.info("Aggregating data...");
    const aggregatedData = aggregateData(reducedBoxScores);
    logger.info(`Aggregated data for ${Object.keys(aggregatedData).length} players`);

    // Remove any null rows after aggregation
    const finalAggregatedData = Object.values(aggregatedData).filter(
      row => !Object.values(row).some(value => value === null || value === "NaN")
    );

    // Write aggregated data to CSV with headers
    const aggregatedHeaders = Object.keys(finalAggregatedData[0]).join(",");
    fs.writeFileSync(
      "./data/aggregatedData.csv",
      aggregatedHeaders + "\n" + finalAggregatedData.map((e) => Object.values(e).join(",")).join("\n")
    );
    logger.info("Aggregated data written to ./data/aggregatedData.csv");

    // Normalize data
    logger.info("Normalizing data...");
    const normalizedData = normalizeData(finalAggregatedData);
    logger.info("Data normalization complete");

    // Write normalized data to CSV with headers
    const normalizedHeaders = Object.keys(normalizedData[0]).join(",");
    fs.writeFileSync(
      "./data/normalizedData.csv",
      normalizedHeaders + "\n" + Object.values(normalizedData).map((e) => Object.values(e).join(",")).join("\n")
    );
    logger.info("Normalized data written to ./data/normalizedData.csv");

    // Train model
    logger.info("Training model...");
    const model = trainModel(Object.values(normalizedData));
    logger.info("Model training complete");

    // Persist model to file
    logger.info("Persisting model to file...");
    fs.writeFileSync("./data/model.json", JSON.stringify(model));
    logger.info("Model trained and persisted successfully");
  } catch (error) {
    logger.error(`Error initializing model: ${error.message}`);
  }
}


module.exports = {
  initializeModel,
};
