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

// Define a function to calculate the number of matches per year
const matchesPerYear = (matchesObj) => {
  // Use the reduce function to iterate through the values of the 'matchesObj' object
  const obj = Object.values(matchesObj).reduce((accumulator, current) => {
    // Extract the season from the current match and update the count in the accumulator object
    accumulator[current.season] = (accumulator[current.season] || 0) + 1;
    return accumulator;
  }, {});

  // The 'obj' object now contains the count of matches for each year

  return obj;
};
