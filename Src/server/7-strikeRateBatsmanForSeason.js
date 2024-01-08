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
    let seasonAndId = {};

    for (let matchKey in matches) {
      seasonAndId[matches[matchKey].id] = Number(matches[matchKey].season);
    }

    fs.createReadStream("../data/deliveries.csv")
      .pipe(csv())
      .on("data", (data) => deliveries.push(data))
      .on("end", () => {
        // Function to process deliveries and calculate runs, balls, and strike rate for each batsman
        const processDeliveries = (
          deliveries,
          seasonAndId,
          seasonWithEachMatchedObj,
          runsAndBowlsOfBatsman,
          strikeRateForEachSeason
        ) => {
          deliveries.forEach((delivery) => {
            const matchId = delivery.match_id;
            const batsman = delivery.batsman;
            const season = seasonAndId[matchId];
            const key = `${season}_${matchId}_${batsman}`;

            // Check if the season is not a property in the seasonWithEachMatchedObj object
            if (!seasonWithEachMatchedObj.hasOwnProperty(season)) {
              seasonWithEachMatchedObj[season] = {};
            }

            // Check if the matchId is not a property in the seasonWithEachMatchedObj[season] object
            if (!seasonWithEachMatchedObj[season].hasOwnProperty(matchId)) {
              seasonWithEachMatchedObj[season][matchId] = {};
            }

            // Create a key for the batsman in the seasonWithEachMatchedObj[season][matchId] object
            seasonWithEachMatchedObj[season][matchId][batsman] = key;

            // Check if the key is not a property in the runsAndBowlsOfBatsman object
            if (!runsAndBowlsOfBatsman.hasOwnProperty(key)) {
              runsAndBowlsOfBatsman[key] = {
                runs: Number(delivery.total_runs),
                ball: Number(delivery.ball),
              };
            } else {
              // If the key is already a property, update the runs and balls information
              runsAndBowlsOfBatsman[key].runs += Number(delivery.total_runs);
              runsAndBowlsOfBatsman[key].ball += 1;
            }
          });
        };

        // Function to calculate strike rate for each batsman in each season
        const calculateStrikeRateForEachSeason = (
          seasonWithEachMatchedObj,
          runsAndBowlsOfBatsman,
          strikeRateForEachSeason
        ) => {
          for (let season in seasonWithEachMatchedObj) {
            for (let matchId in seasonWithEachMatchedObj[season]) {
              for (let playerIndex in seasonWithEachMatchedObj[season][
                matchId
              ]) {
                const key =
                  seasonWithEachMatchedObj[season][matchId][playerIndex];
                const playerRunsAndBall = runsAndBowlsOfBatsman[key];
                const calculate = calcStrikeRate(playerRunsAndBall);

                // Check if the season is not a property in the strikeRateForEachSeason object
                if (!strikeRateForEachSeason.hasOwnProperty(season)) {
                  strikeRateForEachSeason[season] = {};
                }

                // Update the strike rate information for the batsman in the season
                strikeRateForEachSeason[season][playerIndex] = calculate;
              }
            }
          }
        };

        // Function to calculate strike rate based on runs and balls
        const calcStrikeRate = (playersRunAndBall) => {
          const noOfBalls = playersRunAndBall.ball;
          const noOfRuns = playersRunAndBall.runs;
          return (noOfRuns / noOfBalls) * 100;
        };

        // Initialize objects to store intermediate and final results
        let seasonWithEachMatchedObj = {};
        let runsAndBowlsOfBatsman = {};
        let strikeRateForEachSeason = {};

        // Process deliveries and calculate strike rate for each batsman in each season
        processDeliveries(
          deliveries,
          seasonAndId,
          seasonWithEachMatchedObj,
          runsAndBowlsOfBatsman,
          strikeRateForEachSeason
        );
        calculateStrikeRateForEachSeason(
          seasonWithEachMatchedObj,
          runsAndBowlsOfBatsman,
          strikeRateForEachSeason
        );

        fs.writeFileSync(
          outputPath,
          JSON.stringify(strikeRateForEachSeason, null, 2)
        );
      });
  });
