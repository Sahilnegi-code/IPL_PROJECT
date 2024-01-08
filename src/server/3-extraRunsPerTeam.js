const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const results = [];
let extraRunsIn2016 = {};

let outputPath = path.join(
  __dirname,
  "..",
  "public",
  "output",
  "extraRunsPerTeam.json"
);

fs.createReadStream("../data/deliveries.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    let arrayMatches = [];

    fs.createReadStream("../data/matches.csv")
      .pipe(csv())
      .on("data", (data) => {
        arrayMatches.push(data);
      })
      .on("end", () => {
        // Initialize an empty object to store the number of matches played per team per year
        let objNumberOfMatchesPerTeamPerYear = {};

        // Iterate through each match in the matchesDetailsInformation object
        for (let key in matchesDetailsInformation) {
          // Get details of the current match
          let matchesDetails = matchesDetailsInformation[key];

          // Check if the season is not already a property in the result object
          if (
            !objNumberOfMatchesPerTeamPerYear.hasOwnProperty(
              matchesDetails.season
            )
          ) {
            // If not, create a new object to store the number of matches played by each team in that season
            let noOfMatchesTeamPlayed = {};

            // Initialize the count for team1 and team2 to 1
            noOfMatchesTeamPlayed[matchesDetails.team1] = 1;
            noOfMatchesTeamPlayed[matchesDetails.team2] = 1;

            // Assign the new object to the season property in the result object
            objNumberOfMatchesPerTeamPerYear[matchesDetails.season] =
              noOfMatchesTeamPlayed;
          } else {
            // If the season already exists in the result object, update the match count for each team

            // Get the existing details for the season
            let details =
              objNumberOfMatchesPerTeamPerYear[matchesDetails.season];

            // Get the team names for the current match
            let team1 = matchesDetails.team1;
            let team2 = matchesDetails.team2;

            // Update the match count for team1
            if (details.hasOwnProperty(team1)) {
              details[team1] = details[team1] + 1;
            } else {
              // If team1 is not present in the details, initialize the count to 1
              details[team1] = 1;
            }

            // Update the match count for team2
            if (details.hasOwnProperty(team2)) {
              details[team2] = details[team2] + 1;
            } else {
              // If team2 is not present in the details, initialize the count to 1
              details[team2] = 1;
            }

            // Update the details in the result object for the current season
            objNumberOfMatchesPerTeamPerYear[matchesDetails.season] = details;
          }
        }

        fs.writeFileSync(outputPath, JSON.stringify(extraRunsIn2016, null, 2));
      });
  });
