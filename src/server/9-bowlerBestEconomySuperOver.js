const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const deliveries = [];
let bowlersBestEconomyInSuperOver = [];
let outputPath = path.join(
  __dirname,
  "..",
  "public",
  "output",
  "9-bowlersBestEconomyInSuperOver.json"
);

fs.createReadStream("../data/deliveries.csv")
  .pipe(csv())
  .on("data", (data) => deliveries.push(data))
  .on("end", () => {
    // Initialize an object to store information about bowlers in super overs
    let objBowlersSuperOverInform = {};

    // Iterate through each entry in the 'deliveries' array
    for (let keyObject in deliveries) {
      // Get the delivery information for the current entry
      let deliveriesInformation = deliveries[keyObject];

      // Create a unique key based on match ID and bowler's name
      const key = `${deliveriesInformation.match_id}_${deliveriesInformation.bowler}`;

      // Check if the current delivery is part of a super over
      if (deliveriesInformation["is_super_over"] === "1") {
        // Check if the key is not a property in 'objBowlersSuperOverInform'
        if (objBowlersSuperOverInform.hasOwnProperty(key) === false) {
          // If not, create a new entry for the key and initialize runs and ball information
          objBowlersSuperOverInform[key] = {
            runs: Number(deliveriesInformation.total_runs),
            ball: 1,
          };
        } else {
          // If the key already exists, update the ball and runs information
          objBowlersSuperOverInform[key].ball++;
          objBowlersSuperOverInform[key].runs += Number(
            deliveriesInformation.total_runs
          );
        }
      }
    }

    // Function to calculate the economy rate based on ball and runs information
    function calculateEconomic(objectOfBallAndRuns) {
      let ball = objectOfBallAndRuns.ball;
      let runs = objectOfBallAndRuns.runs;
      let calculate = runs / ball;
      return Math.floor(calculate * 100);
    }

    // Create an array containing keys from 'objBowlersSuperOverInform'
    let arrayBowlersEconomySuperOver = Object.keys(objBowlersSuperOverInform);

    // Function to calculate the economy rate for each bowler in a super over
    function calculateBowlersEconomySuperOver(
      arrayBowlersEconomySuperOver,
      objBowlersSuperOverInform
    ) {
      const resultBowlersEconomySuperOver = [];

      // Iterate through each key in 'arrayBowlersEconomySuperOver'
      for (let i = 0; i < arrayBowlersEconomySuperOver.length; i++) {
        const bowlersSuperOverInformKey = arrayBowlersEconomySuperOver[i];
        const nameOfBowler = bowlersSuperOverInformKey.split("_")[1];

        // Calculate the economy rate for the current bowler
        const calculatedEconomy = calculateEconomic(
          objBowlersSuperOverInform[bowlersSuperOverInformKey]
        );

        // Create an array with the calculated economy rate and bowler's name and push it to 'resultBowlersEconomySuperOver'
        const arrayEconomy = [calculatedEconomy, nameOfBowler];
        resultBowlersEconomySuperOver.push(arrayEconomy);
      }

      return resultBowlersEconomySuperOver;
    }

    // Call the function to calculate the economy rate for bowlers in a super over
    arrayBowlersEconomySuperOver = calculateBowlersEconomySuperOver(
      arrayBowlersEconomySuperOver,
      objBowlersSuperOverInform
    );

    // Sort 'arrayBowlersEconomySuperOver' based on the economy rate in ascending order
    arrayBowlersEconomySuperOver.sort((bowler1, bowler2) => {
      if (bowler1[0] < bowler2[0]) return -1;
      return 1;
    });
    try {
      fs.writeFileSync(
        outputPath,
        JSON.stringify(arrayBowlersEconomySuperOver[0], null, 2)
      );
    } catch {
      console.log("File is not Created ");
    }
  });
