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
        // Function to filter matches by a specific season
        const filterMatchesBySeason = (matches, season) => {
          let tempMatches = matches.filter((match) => {
            // Check if the match belongs to the specified season
            if (match.season === season) {
              return true;
            }
            return false;
          });

          return tempMatches;
        };

        // Function to extract match IDs from an array of matches
        const extractMatchIds = (matches) => {
          let matchesId = matches.map((match) => {
            return match.id;
          });
          return matchesId;
        };

        // Function to calculate extra runs for a given set of results and match IDs
        const calculateExtraRuns = (results, matchIds) =>
          results.reduce((extraRuns, result) => {
            // Check if the result belongs to one of the specified match IDs
            if (matchIds.includes(result.match_id)) {
              const team = result.batting_team;
              extraRuns[team] =
                (parseInt(extraRuns[team]) || 0) + parseInt(result.extra_runs);
            }
            return extraRuns;
          }, {});

        // Function to calculate extra runs for a specific season
        const objSeasonAndidOfMatches = (arrayMatches, season) => {
          // Filter matches for the specified season
          const matchesInSeason = filterMatchesBySeason(arrayMatches, season);

          // Extract match IDs for matches in the specified season
          const matchIds = extractMatchIds(matchesInSeason);

          // Calculate extra runs for the specified season
          return calculateExtraRuns(results, matchIds);
        };

        // Calculate extra runs for the year 2016
        const extraRunsIn2016 = objSeasonAndidOfMatches(arrayMatches, "2016");

        fs.writeFileSync(outputPath, JSON.stringify(extraRunsIn2016, null, 2));
      });
  });
