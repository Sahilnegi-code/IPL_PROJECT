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

              if (!seasonWithEachMatchedObj.hasOwnProperty(season)) {
                seasonWithEachMatchedObj[season] = {};
              }

              if (!seasonWithEachMatchedObj[season].hasOwnProperty(matchId)) {
                seasonWithEachMatchedObj[season][matchId] = {};
              }

            seasonWithEachMatchedObj[season][matchId][batsman] = key;

            if (!runsAndBowlsOfBatsman.hasOwnProperty(key)) {
              runsAndBowlsOfBatsman[key] = {
                runs: Number(delivery.total_runs),
                ball: Number(delivery.ball),
              };
            } else {
              runsAndBowlsOfBatsman[key].runs += Number(delivery.total_runs);
              runsAndBowlsOfBatsman[key].ball += 1;
            }
          });
        };

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

                if (!strikeRateForEachSeason.hasOwnProperty(season)) {
                  strikeRateForEachSeason[season] = {};
                }

                strikeRateForEachSeason[season][playerIndex] = calculate;
              }
            }
          }
        };

        const calcStrikeRate = (playersRunAndBall) => {
          const noOfBalls = playersRunAndBall.ball;
          const noOfRuns = playersRunAndBall.runs;
          return (noOfRuns / noOfBalls) * 100;
        };

        let seasonWithEachMatchedObj = {};
        let runsAndBowlsOfBatsman = {};
        let strikeRateForEachSeason = {};

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
