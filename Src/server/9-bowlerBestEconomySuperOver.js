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
    const objBowlersSuperOverInform = deliveries.reduce(
      (bowlersSuperOverInform, deliveriesInformation) => {
        const key = `${deliveriesInformation.match_id}_${deliveriesInformation.bowler}`;
        // "is_super_over": "0",
        if (deliveriesInformation["is_super_over"] === "1") {
          if (bowlersSuperOverInform.hasOwnProperty(key) === false) {
            bowlersSuperOverInform[key] = {
              runs: Number(deliveriesInformation.total_runs),
              ball: 1,
            };
          } else {
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

    function calculateEconomic(objectOfBallAndRuns) {
      let ball = objectOfBallAndRuns.ball;
      let runs = objectOfBallAndRuns.runs;
      let calculate = runs / ball;
      return Math.floor(calculate * 100);
    }
    let arrayBowlersEconomySuperOver = Object.keys(objBowlersSuperOverInform);

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
    arrayBowlersEconomySuperOver.sort((bowler1, bowler2) => {
      if (bowler1 < bowler2) return -1;
      return 1;
    });

    fs.writeFileSync(
      outputPath,
      JSON.stringify(arrayBowlersEconomySuperOver[0], null, 2)
    );
  });
