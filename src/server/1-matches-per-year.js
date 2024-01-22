const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const results = [];

let outputPath = path.join(
  __dirname,
  "..",
  "public",
  "output",
  "matchesPerYear.json"
);

fs.createReadStream("../data/matches.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    let result = matchesPerYear(results);

    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  });

const matchesPerYear = (matchesObj) => {
  // It keeps the result that matches conducted per year .
  let matchesConductedPerYear = {};

  // looping through matches Object
  for (let keys in matchesObj) {
    try {
      matchesConductedPerYear[matchesObj[keys].season] =
        (matchesConductedPerYear[matchesObj[keys].season] || 0) + 1;
    } catch {
      console.log("error");
    }
  }
  return matchesConductedPerYear;
};