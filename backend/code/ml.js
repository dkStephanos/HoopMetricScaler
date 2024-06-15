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

function aggregateDataByPlayer(data) {
  const playerData = {};

  data.forEach(row => {
    const playerName = row.player_name;

    if (!playerData[playerName]) {
      playerData[playerName] = {
        player_name: row.player_name,
        PTS: 0,
        "+/-": 0,
        TRB: 0,
        trueShooting: 0,
        assistToTurnover: 0,
        stocks: 0,
        games: 0,  // To keep track of the number of games
        minutesPlayed: 0,
        usage: 0
      };
    }

    // Sum up the values
    playerData[playerName].PTS += row.PTS;
    playerData[playerName]["+/-"] += row["+/-"];
    playerData[playerName].TRB += row.TRB;
    playerData[playerName].trueShooting += row.trueShooting;
    playerData[playerName].assistToTurnover += row.assistToTurnover;
    playerData[playerName].stocks += row.stocks;
    playerData[playerName].minutesPlayed += row.minutesPlayed;
    playerData[playerName].usage += row.usage;
    playerData[playerName].games += 1;
  });

  // Average the values where appropriate
  Object.keys(playerData).forEach(player => {
    playerData[player].trueShooting /= playerData[player].games;
    playerData[player].assistToTurnover /= playerData[player].games;
    playerData[player].stocks /= playerData[player].games;
    playerData[player].minutesPlayed /= playerData[player].games;
    playerData[player].usage /= playerData[player].games;
  });

  return playerData;
}

function normalizeData(data) {
  const normalizedData = {};
  const stats = [
    "PTS",
    "+/-",
    "TRB",
    "trueShooting",
    "assistToTurnover",
    "stocks"
  ];
  const minMax = {};

  stats.forEach((stat) => {
    const values = Object.values(data).map((player) => player[stat]);
    minMax[stat] = { min: Math.min(...values), max: Math.max(...values) };
  });

  Object.keys(data).forEach((player) => {
    normalizedData[player] = {};
    stats.forEach((stat) => {
      const { min, max } = minMax[stat];
      normalizedData[player][stat] = min === max ? 0 : (data[player][stat] - min) / (max - min);
    });
    normalizedData[player]["minutesPlayed"] = data[player]["minutesPlayed"];
    normalizedData[player]["usage"] = data[player]["usage"];
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
    ).map(row => {
      const trueShooting = ((+row.PTS) / (2 * (+row.FGA + 0.44 * +row.FTA))) || 0;
      const assistToTurnover = (+row.AST / +row.TOV) || 0;
      const stocks = (+row.STL + +row.BLK) || 0;
      const minutesPlayed = parseFloat(row.MP.split(':')[0]) + parseFloat(row.MP.split(':')[1]) / 60;
      const usage = ((+row.FGA + 0.44 * +row.FTA + +row.TOV) / minutesPlayed) || 0;
      return {
        player_name: row.player_name,
        PTS: +row.PTS,
        "+/-": +row["+/-"],  // Ensure plus/minus is treated as a number
        TRB: +row.TRB,
        trueShooting: isFinite(trueShooting) ? trueShooting : 0,
        assistToTurnover: isFinite(assistToTurnover) ? assistToTurnover : 0,
        stocks: isFinite(stocks) ? stocks : 0,
        minutesPlayed: isFinite(minutesPlayed) ? minutesPlayed : 0,
        usage: isFinite(usage) ? usage : 0
      };
    }).filter(row => row.minutesPlayed >= 3);
    
    logger.info(`Loaded ${cleanedBoxScores.length} cleaned box scores`);

    // Write cleaned and reduced box scores to CSV with headers
    const reducedHeaders = Object.keys(cleanedBoxScores[0]).join(",");
    fs.writeFileSync(
      "./data/cleaned_boxscore.csv",
      reducedHeaders + "\n" + cleanedBoxScores.map((e) => Object.values(e).join(",")).join("\n")
    );
    logger.info("Cleaned and reduced box scores written to ./data/cleaned_boxscore.csv");

    // Aggregate data
    logger.info("Aggregating data...");
    const aggregatedData = aggregateDataByPlayer(cleanedBoxScores);
    logger.info(`Aggregated data for ${Object.keys(aggregatedData).length} players`);

    // Remove any null rows after aggregation
    const finalAggregatedData = Object.values(aggregatedData).filter(
      row => !Object.values(row).some(value => value === null || value === "NaN")
    );

    // Write aggregated data to CSV with headers
    const aggregatedHeaders = Object.keys(aggregatedData[Object.keys(aggregatedData)[0]]).join(",");
    fs.writeFileSync(
      "./data/aggregatedData.csv",
      aggregatedHeaders + "\n" + Object.values(aggregatedData).map((e) => Object.values(e).join(",")).join("\n")
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
