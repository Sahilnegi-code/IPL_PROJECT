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
        // Initialize an empty object to store ball and runs information for each match and bowler combination
        let matchIdAndBowlerObj = {};

        // Iterate through each delivery in the 'deliveries' object
        for (let informKey in deliveries) {
          // Check if the match ID of the current delivery is included in the 'idOfMatches' array
          if (idOfMatches.includes(Number(deliveries[informKey].match_id))) {
            // Create a unique key combining match ID and bowler's name
            let keyMatchIdAndBowler =
              String(deliveries[informKey].match_id) +
              "_" +
              String(deliveries[informKey].bowler);

            // Check if the key exists in 'matchIdAndBowlerObj' object
            if (
              matchIdAndBowlerObj.hasOwnProperty(keyMatchIdAndBowler) === false
            ) {
              // If not, initialize the key with an object containing ball and runs information
              matchIdAndBowlerObj[keyMatchIdAndBowler] = {};
              matchIdAndBowlerObj[keyMatchIdAndBowler].ball = 1;
              matchIdAndBowlerObj[keyMatchIdAndBowler].runs = Number(
                deliveries[informKey].batsman_runs
              );
            } else {
              // If the key exists, update the ball and runs information
              matchIdAndBowlerObj[keyMatchIdAndBowler].ball +=
                matchIdAndBowlerObj[keyMatchIdAndBowler].ball + 1;
              matchIdAndBowlerObj[keyMatchIdAndBowler].runs += Number(
                deliveries[informKey].batsman_runs
              );
            }
          }
        }

        // Function to calculate the economy rate based on the ball and runs information
        function calculateEconomic(objectOfBallAndRuns) {
          let ball = objectOfBallAndRuns.ball;
          let runs = objectOfBallAndRuns.runs;
          let calculate = runs / ball;
          return calculate * 100;
        }

        // Iterate through each bowler in 'matchIdAndBowlerObj' and calculate the economy rate
        for (let bowlerAsKey in matchIdAndBowlerObj) {
          let bowler = bowlerAsKey.split("_")[1];
          let calculated = calculateEconomic(matchIdAndBowlerObj[bowlerAsKey]);

          // Create an array with the calculated economy rate and bowler's name and push it to 'top10EconomicPlayer' array
          let bowlerArray = [];
          bowlerArray.push(calculated);
          bowlerArray.push(bowler);
          top10EconomicPlayer.push(bowlerArray);
        }

        // Sort 'top10EconomicPlayer' array based on economy rate in descending order
        top10EconomicPlayer.sort((economy1, economy2) => {
          if (economy1[0] > economy2[0]) {
            return -1;
          }
          return 1;
        });

        // Extract the top 10 economic bowlers' names and store them in 'resultTop10EconomicBowler' array
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
