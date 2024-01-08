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
// 9-bowlerBestEconomySuperOver.js
fs.createReadStream("../data/deliveries.csv")
  .pipe(csv())
  .on("data", (data) => deliveries.push(data))
  .on("end", () => {
    // Use reduce to create an object containing super over information for each bowler
    const objBowlersSuperOverInform = deliveries.reduce(
      (bowlersSuperOverInform, deliveriesInformation) => {
        const key = `${deliveriesInformation.match_id}_${deliveriesInformation.bowler}`;
        // Check if it's a super over
        if (deliveriesInformation["is_super_over"] === "1") {
          if (bowlersSuperOverInform.hasOwnProperty(key) === false) {
            // Initialize the bowler's super over information
            bowlersSuperOverInform[key] = {
              runs: Number(deliveriesInformation.total_runs),
              ball: 1,
            };
          } else {
            // Increment ball count and add runs for the bowler's super over
            bowlersSuperOverInform[key].ball++;
            bowlersSuperOverInform[key].runs += Number(
              deliveriesInformation.total_runs
            );
          }
        }

        return bowlersSuperOverInform;
      },
      {}
    );

    // Function to calculate the economic rate
    function calculateEconomic(objectOfBallAndRuns) {
      let ball = objectOfBallAndRuns.ball;
      let runs = objectOfBallAndRuns.runs;
      let calculate = runs / ball;
      return Math.floor(calculate * 100);
    }

    // Get an array of bowlers from the keys of the super over information object
    let arrayBowlersEconomySuperOver = Object.keys(objBowlersSuperOverInform);

    // Use reduce to calculate and store the economic rate for each bowler
    arrayBowlersEconomySuperOver = arrayBowlersEconomySuperOver.reduce(
      (resultBowlersEconomySuperOver, bowlersSuperOverInformKey) => {
        let nameOfBowler = bowlersSuperOverInformKey.split("_")[1];

        let calculatedEconomy = calculateEconomic(
          objBowlersSuperOverInform[bowlersSuperOverInformKey]
        );

        let arrayEconomy = [calculatedEconomy, nameOfBowler];

        resultBowlersEconomySuperOver.push(arrayEconomy);

        return resultBowlersEconomySuperOver;
      },
      []
    );

    // Sort the array of bowlers based on the economic rate
    arrayBowlersEconomySuperOver.sort((bowler1, bowler2) => {
      if (bowler1[0] < bowler2[0]) return -1;
      return 1;
    });

    fs.writeFileSync(
      outputPath,
      JSON.stringify(arrayBowlersEconomySuperOver[0], null, 2)
    );
  });
