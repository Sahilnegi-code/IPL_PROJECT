const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const results = [];
const matches = [];
let deliveries = [];
// Top 10 economical bowlers in the year 2015
let top10EconomicPlayer = [];
let outputPath = path.join(
  __dirname,
  "..",
  "public",
  "output",
  "top10EconomicBowler.json"
);

fs.createReadStream("../data/matches.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    let idOfMatches = [];

    for (let matchDetails in results) {
      if (results[matchDetails].season === "2015") {
        idOfMatches.push(Number(results[matchDetails].id));
      }
    }

    fs.createReadStream("../data/deliveries.csv")
      .pipe(csv())
      .on("data", (data) => deliveries.push(data))
      .on("end", () => {
        let matchIdAndBowlerObj = {};
        for (let informKey in deliveries) {
          if (idOfMatches.includes(Number(deliveries[informKey].match_id))) {
            let keyMatchIdAndBowler =
              String(deliveries[informKey].match_id) +
              "_" +
              String(deliveries[informKey].bowler);

            if (
              matchIdAndBowlerObj.hasOwnProperty(keyMatchIdAndBowler) === false
            ) {
              matchIdAndBowlerObj[keyMatchIdAndBowler] = {};
              matchIdAndBowlerObj[keyMatchIdAndBowler].ball = 1;
              matchIdAndBowlerObj[keyMatchIdAndBowler].runs = Number(
                deliveries[informKey].batsman_runs
              );
            } else {
              matchIdAndBowlerObj[keyMatchIdAndBowler].ball =
                matchIdAndBowlerObj[keyMatchIdAndBowler].ball + 1;
              matchIdAndBowlerObj[keyMatchIdAndBowler].runs += Number(
                deliveries[informKey].batsman_runs
              );
            }
          }
        }
        function calculateEconomic(objectOfBallAndRuns) {
          let ball = objectOfBallAndRuns.ball;
          let runs = objectOfBallAndRuns.runs;
          let calculate = runs / ball;
          return calculate * 100;
        }
        for (let bowlerAsKey in matchIdAndBowlerObj) {
          let bowler = bowlerAsKey.split("_")[1];
          let calculated = calculateEconomic(matchIdAndBowlerObj[bowlerAsKey]);
          let bowlerArray = [];
          bowlerArray.push(calculated);
          bowlerArray.push(bowler);
          top10EconomicPlayer.push(bowlerArray);
        }

        top10EconomicPlayer.sort((economy1, economy2) => {
          if (economy1[0] > economy2[0]) {
            return -1;
          }
          return 1;
        });

        let resultTop10EconomicBowler = [];
        for (let bowler = 0; bowler < 10; bowler++) {
          let val = top10EconomicPlayer[bowler][1];
          resultTop10EconomicBowler.push(val);
        }

        fs.writeFileSync(
          outputPath,
          JSON.stringify(resultTop10EconomicBowler, null, 2)
        );
      });
  });
