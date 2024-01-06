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
    let objBowlersSuperOverInform = {};
    for (let keyObject in deliveries) {
      let deliveriesInformation = deliveries[keyObject];
      const key = `${deliveriesInformation.match_id}_${deliveriesInformation.bowler}`;

      if (deliveriesInformation["is_super_over"] === "1") {
        if (objBowlersSuperOverInform.hasOwnProperty(key) === false) {
          objBowlersSuperOverInform[key] = {
            runs: Number(deliveriesInformation.total_runs),
            ball: 1,
          };
        } else {
          objBowlersSuperOverInform[key].ball++;
          objBowlersSuperOverInform[key].runs += Number(
            deliveriesInformation.total_runs
          );
        }
      }
    }

    function calculateEconomic(objectOfBallAndRuns) {
      let ball = objectOfBallAndRuns.ball;
      let runs = objectOfBallAndRuns.runs;
      let calculate = runs / ball;
      return Math.floor(calculate * 100);
    }

    let arrayBowlersEconomySuperOver = Object.keys(objBowlersSuperOverInform);

    // arrayBowlersEconomySuperOver = arrayBowlersEconomySuperOver.reduce(
    //   (resultBowlersEconomySuperOver, bowlersSuperOverInformKey) => {
    //     let nameOfBowler = bowlersSuperOverInformKey.split("_")[1];

    //     let calculatedEconomy = calculateEconomic(
    //       objBowlersSuperOverInform[bowlersSuperOverInformKey]
    //     );

    //     let arrayEconomy = [calculatedEconomy, nameOfBowler];

    //     resultBowlersEconomySuperOver.push(arrayEconomy);

    //     return resultBowlersEconomySuperOver;
    //   },
    //   []
    // );

    function calculateBowlersEconomySuperOver(
      arrayBowlersEconomySuperOver,
      objBowlersSuperOverInform
    ) {
      const resultBowlersEconomySuperOver = [];

      for (let i = 0; i < arrayBowlersEconomySuperOver.length; i++) {
        const bowlersSuperOverInformKey = arrayBowlersEconomySuperOver[i];
        const nameOfBowler = bowlersSuperOverInformKey.split("_")[1];
        const calculatedEconomy = calculateEconomic(
          objBowlersSuperOverInform[bowlersSuperOverInformKey]
        );
        const arrayEconomy = [calculatedEconomy, nameOfBowler];
        resultBowlersEconomySuperOver.push(arrayEconomy);
      }

      return resultBowlersEconomySuperOver;
    }

    arrayBowlersEconomySuperOver = calculateBowlersEconomySuperOver(
      arrayBowlersEconomySuperOver,
      objBowlersSuperOverInform
    );

    arrayBowlersEconomySuperOver.sort((bowler1, bowler2) => {
      if (bowler1[0] < bowler2[0]) return -1;
      return 1;
    });
    console.log(arrayBowlersEconomySuperOver);
    fs.writeFileSync(
      outputPath,
      JSON.stringify(arrayBowlersEconomySuperOver[0], null, 2)
    );
  });
