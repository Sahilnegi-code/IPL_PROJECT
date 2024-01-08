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
        // Initialize an object to store information about each bowler in a match
        let matchIdAndBowlerObj = {};

        // Iterate through each entry in the 'deliveries' array
        for (let informKey in deliveries) {
          // Check if the match ID is included in the specified matches
          if (idOfMatches.includes(Number(deliveries[informKey].match_id))) {
            // Create a unique key based on match ID and bowler's name
            let keyMatchIdAndBowler =
              String(deliveries[informKey].match_id) +
              "_" +
              String(deliveries[informKey].bowler);

            // Check if the key is not a property in 'matchIdAndBowlerObj'
            if (
              matchIdAndBowlerObj.hasOwnProperty(keyMatchIdAndBowler) === false
            ) {
              // If not, create a new entry for the key and initialize ball and runs information
              matchIdAndBowlerObj[keyMatchIdAndBowler] = {};
              matchIdAndBowlerObj[keyMatchIdAndBowler].ball = 1;
              matchIdAndBowlerObj[keyMatchIdAndBowler].runs = Number(
                deliveries[informKey].batsman_runs
              );
            } else {
              // If the key already exists, update the ball and runs information
              matchIdAndBowlerObj[keyMatchIdAndBowler].ball =
                matchIdAndBowlerObj[keyMatchIdAndBowler].ball + 1;
              matchIdAndBowlerObj[keyMatchIdAndBowler].runs += Number(
                deliveries[informKey].batsman_runs
              );
            }
          }
        }

        // Function to calculate the economy rate based on ball and runs information
        function calculateEconomic(objectOfBallAndRuns) {
          let ball = objectOfBallAndRuns.ball;
          let runs = objectOfBallAndRuns.runs;
          let calculate = runs / ball;
          return calculate * 100;
        }

        // Array to store the top 10 economic players
        let top10EconomicPlayer = [];

        // Iterate through each key in 'matchIdAndBowlerObj'
        for (let bowlerAsKey in matchIdAndBowlerObj) {
          // Extract the bowler's name from the key
          let bowler = bowlerAsKey.split("_")[1];

          // Calculate the economic rate for the current bowler
          let calculated = calculateEconomic(matchIdAndBowlerObj[bowlerAsKey]);

          // Create an array with the calculated economic rate and bowler's name and push it to 'top10EconomicPlayer'
          let bowlerArray = [];
          bowlerArray.push(calculated);
          bowlerArray.push(bowler);
          top10EconomicPlayer.push(bowlerArray);
        }

        // Sort 'top10EconomicPlayer' based on the economic rate in descending order
        top10EconomicPlayer.sort((economy1, economy2) => {
          if (economy1[0] > economy2[0]) {
            return -1;
          }
          return 1;
        });

        // Extract the names of the top 10 economic bowlers
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
