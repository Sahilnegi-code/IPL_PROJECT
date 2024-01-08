const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const results = [];
let outputPath = path.join(
  __dirname,
  "..",
  "public",
  "output",
  "matchesWonPerTeamPerYear.json"
);
// give the output of numberOfMatchesPerTeamPerYear
const numberOfMatchesPerTeamPerYear = (matchesDetailsInformation) => {
  // Use the reduce function to iterate through the values of the 'matchesDetailsInformation' object
  let objNumberOfMatchesPerTeamPerYear = Object.values(
    matchesDetailsInformation
  ).reduce((accumulator, matchDetails) => {
    // Destructure properties from the current match details
    const { season, team1, team2 } = matchDetails;

    // Initialize the accumulator object for the current season if not present
    accumulator[season] = accumulator[season] || {};

    // Increment the count of matches for 'team1' and 'team2' in the current season
    accumulator[season][team1] = (accumulator[season][team1] || 0) + 1;
    accumulator[season][team2] = (accumulator[season][team2] || 0) + 1;

    // Return the updated accumulator object
    return accumulator;
  }, {});

  // 2-matches -won -per-team-per-year.js
  fs.createReadStream("../data/matches.csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      let result = numberOfMatchesPerTeamPerYear(results);

      fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    });

  return objNumberOfMatchesPerTeamPerYear;
};
