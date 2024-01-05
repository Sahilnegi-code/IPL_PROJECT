const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const results = [];
const deliveries = [];
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
    let arrayOfYear = [];

    for (let matchDetails in results) {
      if (results[matchDetails].season === 2015) {
        arrayOfYear.push(results[matchDetails].id);
      }
    }

    fs.createReadStream("../data/deliveries.csv")
      .pipe(csv())
      .on("data", (data) => deliveries.push(data))
      .on("end", () => {
        let arrayOfYear = [];

        for (let matchDetails in results) {
          if (results[matchDetails].season === 2015) {
            arrayOfYear.push(results[matchDetails].id);
          }
        }

        

      });
  });
