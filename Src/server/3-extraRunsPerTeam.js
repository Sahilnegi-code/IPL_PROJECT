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
        const filterMatchesBySeason = (matches, season) => {
          let tempMatches = matches.filter((match) => {
            if (match.season === season) {
              return true;
            }
            return false;
          });

          return tempMatches;
        };

        const extractMatchIds = (matches) => {
          let matchesId = matches.map((match) => {
            return match.id;
          });
         return matchesId;
        };

        const calculateExtraRuns = (results, matchIds) =>
          results.reduce((extraRuns, result) => {
            if (matchIds.includes(result.match_id)) {
              const team = result.batting_team;
              extraRuns[team] = (parseInt(extraRuns[team]) || 0) + parseInt(result.extra_runs);
            }
            return extraRuns;
          }, {});

        const objSeasonAndidOfMatches = (arrayMatches, season) => {
          const matchesInSeason = filterMatchesBySeason(arrayMatches, season);
          const matchIds = extractMatchIds(matchesInSeason);
          return calculateExtraRuns(results, matchIds);
        };

        const extraRunsIn2016 = objSeasonAndidOfMatches(arrayMatches, "2016");

        fs.writeFileSync(outputPath, JSON.stringify(extraRunsIn2016, null, 2));
      });
  });
