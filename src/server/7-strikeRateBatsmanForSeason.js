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
    let seasonWithEachMatchedObj = {};
    fs.createReadStream("../data/deliveries.csv")
      .pipe(csv())
      .on("data", (data) => deliveries.push(data))
      .on("end", () => {
        for (let deliveriesInform in deliveries) {
          if (
            seasonWithEachMatchedObj.hasOwnProperty(
              seasonAndId[deliveries[deliveriesInform].match_id]
            ) === false
          ) {
            let season = seasonAndId[deliveries[deliveriesInform].match_id];
            let matchId = deliveries[deliveriesInform].match_id;
            let batsman = deliveries[deliveriesInform].batsman;
            seasonWithEachMatchedObj[season] = {};
            seasonWithEachMatchedObj[season][matchId] = {};
            seasonWithEachMatchedObj[season][matchId][batsman] =
              String(season) + "_" + String(matchId) + "_" + String(batsman);
          } else {
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
        let runsAndBowlsOfBatsman = {};

        for (deliveriesInform in deliveries) {
          let season = String(
            seasonAndId[deliveries[deliveriesInform].match_id]
          );
          let ball = deliveries[deliveriesInform].ball;
          let matchId = String(deliveries[deliveriesInform].match_id);
          let batsman = String(deliveries[deliveriesInform].batsman);
          let total_runs = deliveries[deliveriesInform].total_runs;
          let key = season + "_" + matchId + "_" + batsman;
          if (runsAndBowlsOfBatsman.hasOwnProperty(key) === false) {
            runsAndBowlsOfBatsman[key] = {};
            runsAndBowlsOfBatsman[key].runs = Number(total_runs);
            runsAndBowlsOfBatsman[key].ball = Number(ball);
          } else {
            runsAndBowlsOfBatsman[key].runs += Number(total_runs);
            runsAndBowlsOfBatsman[key].ball += 1;
          }
        }

        function calcStrikeRate(playersRunAndBall) {
          let noOfBalls = playersRunAndBall.ball;
          let noOfRuns = playersRunAndBall.runs;
          let calc = noOfRuns / noOfBalls;
          return calc * 100;
        }

        for (let season in seasonWithEachMatchedObj) {
          for (let matchId in seasonWithEachMatchedObj[season]) {
            for (let playerIndex in seasonWithEachMatchedObj[season][matchId]) {
              let playerRunsAndBall =
                runsAndBowlsOfBatsman[
                  seasonWithEachMatchedObj[season][matchId][playerIndex]
                ];
              let calculate = calcStrikeRate(playerRunsAndBall);

              if (strikeRateForEachSeason.hasOwnProperty(season) === false) {
                strikeRateForEachSeason[season] = {};
                strikeRateForEachSeason[season][playerIndex] = calculate;
              } else {
                strikeRateForEachSeason[season][playerIndex] = calculate;
              }
            }
          }
        }

        fs.writeFileSync(
          outputPath,
          JSON.stringify(strikeRateForEachSeason, null, 2)
        );
      });
  });
