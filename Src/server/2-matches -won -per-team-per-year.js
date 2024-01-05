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
  let objNumberOfMatchesPerTeamPerYear = Object.values(
    matchesDetailsInformation
  ).reduce((accumulator, matchDetails) => {
    const { season, team1, team2 } = matchDetails;

    accumulator[season] = accumulator[season] || {};

    accumulator[season][team1] = (accumulator[season][team1] || 0) + 1;
    accumulator[season][team2] = (accumulator[season][team2] || 0) + 1;

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
