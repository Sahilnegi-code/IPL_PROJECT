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
        const objSeasonAndidOfMatches = (arrayMatches) => {
          const teamName = [];

          for (let key in arrayMatches) {
            if (arrayMatches[key].season === "2016") {
              teamName.push(arrayMatches[key].id);
            }
          }

          return teamName;
        };
        arrayMatches = objSeasonAndidOfMatches(arrayMatches);

        for (let key in results) {
          if (arrayMatches.includes(results[key].match_id)) {
            extraRunsIn2016[results[key].batting_team] = (parseInt(extraRunsIn2016[results[key].batting_team]) || 0) + parseInt(results[key].extra_runs);
          }
        }

        fs.writeFileSync(outputPath, JSON.stringify(extraRunsIn2016, null, 2));
      });
  });
