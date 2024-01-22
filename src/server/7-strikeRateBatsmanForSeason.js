const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const matches = [];
let deliveries = [];
let strikeRateForEachSeason = {};
let outputPath = path.join(
  __dirname,
  "..",
  "public",
  "output",
  "strikeRateOfEachSeason.json"
);

fs.createReadStream("../data/matches.csv")
  .pipe(csv())
  .on("data", (data) => matches.push(data))
  .on("end", () => {
    // Initialize an object to store the mapping of match ID to season
    let seasonAndId = {};

    // Iterate through each match in the 'matches' array and populate 'seasonAndId'
    for (let matchKey in matches) {
      seasonAndId[matches[matchKey].id] = Number(matches[matchKey].season);
    }

    // Initialize an object to store the relationship between season, match, and batsman
    let seasonWithEachMatchedObj = {};

    // Read data from the 'deliveries.csv' file and process it using the 'csv' module
    fs.createReadStream("../data/deliveries.csv")
      .pipe(csv())
      .on("data", (data) => deliveries.push(data))
      .on("end", () => {
        // Iterate through each entry in the 'deliveries' array
        for (let deliveriesInform in deliveries) {
          // Check if the current season is not a property in 'seasonWithEachMatchedObj'
          if (
            seasonWithEachMatchedObj.hasOwnProperty(
              seasonAndId[deliveries[deliveriesInform].match_id]
            ) === false
          ) {
            // If not, create new entries for season, match, and batsman
            let season = seasonAndId[deliveries[deliveriesInform].match_id];
            let matchId = deliveries[deliveriesInform].match_id;
            let batsman = deliveries[deliveriesInform].batsman;

            seasonWithEachMatchedObj[season] = {};
            seasonWithEachMatchedObj[season][matchId] = {};
            seasonWithEachMatchedObj[season][matchId][batsman] =
              String(season) + "_" + String(matchId) + "_" + String(batsman);
          } else {
            // If the season already exists, update the entries for match and batsman
            let season = seasonAndId[deliveries[deliveriesInform].match_id];
            let matchId = deliveries[deliveriesInform].match_id;
            let batsman = deliveries[deliveriesInform].batsman;

            if (
              seasonWithEachMatchedObj[season].hasOwnProperty(matchId) === false
            ) {
              seasonWithEachMatchedObj[season][matchId] = {};
              seasonWithEachMatchedObj[season][matchId][batsman] =
                String(season) + "_" + String(matchId) + "_" + String(batsman);
            } else {
              seasonWithEachMatchedObj[season][matchId][batsman] =
                String(season) + "_" + String(matchId) + "_" + String(batsman);
            }
          }
        }

        // Initialize an object to store runs and balls information for each batsman
        let runsAndBowlsOfBatsman = {};

        // Iterate through each entry in the 'deliveries' array
        for (deliveriesInform in deliveries) {
          // Extract relevant information from the current entry
          let season = String(
            seasonAndId[deliveries[deliveriesInform].match_id]
          );
          let ball = deliveries[deliveriesInform].ball;
          let matchId = String(deliveries[deliveriesInform].match_id);
          let batsman = String(deliveries[deliveriesInform].batsman);
          let total_runs = deliveries[deliveriesInform].total_runs;

          // Create a unique key based on season, match, and batsman
          let key = season + "_" + matchId + "_" + batsman;

          // Check if the key is not a property in 'runsAndBowlsOfBatsman'
          if (runsAndBowlsOfBatsman.hasOwnProperty(key) === false) {
            // If not, create a new entry for the key and initialize runs and ball information
            runsAndBowlsOfBatsman[key] = {};
            runsAndBowlsOfBatsman[key].runs = Number(total_runs);
            runsAndBowlsOfBatsman[key].ball = Number(ball);
          } else {
            // If the key already exists, update the runs and ball information
            runsAndBowlsOfBatsman[key].runs += Number(total_runs);
            runsAndBowlsOfBatsman[key].ball += 1;
          }
        }

        // Function to calculate the strike rate based on runs and balls information
        function calcStrikeRate(playersRunAndBall) {
          let noOfBalls = playersRunAndBall.ball;
          let noOfRuns = playersRunAndBall.runs;
          let calc = noOfRuns / noOfBalls;
          return calc * 100;
        }

        // Initialize an object to store strike rates for each batsman in each season
        for (let season in seasonWithEachMatchedObj) {
          for (let matchId in seasonWithEachMatchedObj[season]) {
            for (let playerIndex in seasonWithEachMatchedObj[season][matchId]) {
              // Get the runs and balls information for the current batsman
              let playerRunsAndBall =
                runsAndBowlsOfBatsman[
                  seasonWithEachMatchedObj[season][matchId][playerIndex]
                ];

              // Calculate the strike rate for the current batsman
              let calculate = calcStrikeRate(playerRunsAndBall);

              // Check if the season is not a property in 'strikeRateForEachSeason'
              if (strikeRateForEachSeason.hasOwnProperty(season) === false) {
                // If not, create a new entry for the season and batsman
                strikeRateForEachSeason[season] = {};
                strikeRateForEachSeason[season][playerIndex] = calculate;
              } else {
                // If the season already exists, update the entry for the batsman
                strikeRateForEachSeason[season][playerIndex] = calculate;
              }
            }
          }
        }
        try {
          fs.writeFileSync(
            outputPath,
            JSON.stringify(strikeRateForEachSeason, null, 2)
          );
        } catch {
          console.log("File is not Created ");
        }
      });
  });