const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const matches = [];
let playerOfMatchEachSeason = {};
let outputPath = path.join(
  __dirname,
  "..",
  "public",
  "output",
  "playerOfMatchEachSeason.json"
);

fs.createReadStream("../data/matches.csv")
  .pipe(csv())
  .on("data", (data) => matches.push(data))
  .on("end", () => {
    const processPlayerOfMatch = (matches) => {
      let playerOfMatchArray = matches.reduce(
        (playerOfMatchEachSeason, objInform) => {
          const season = objInform.season;

          if (playerOfMatchEachSeason.hasOwnProperty(season) === false) {
            playerOfMatchEachSeason[season] = [[1, objInform.player_of_match]];
          } else {
            const arrayOfSeason = playerOfMatchEachSeason[season];
            const index = arrayOfSeason.findIndex(
              (player) => player[1] === objInform.player_of_match
            );

            if (index !== -1) {
              arrayOfSeason[index][0]++;
            } else {
              arrayOfSeason.push([1, objInform.player_of_match]);
            }
          }

          return playerOfMatchEachSeason;
        },
        {}
      );

      return playerOfMatchArray;
    };

    const sortAndExtractTopPlayer = (playerOfMatchEachSeason) => {
      const result = {};
      for (let year in playerOfMatchEachSeason) {
        const season = playerOfMatchEachSeason[year];
        season.sort((season1, season2) => season2[0] - season1[0]);
        result[year] = season[0][1];
      }
      return result;
    };

    const playerOfMatchEachSeason = processPlayerOfMatch(matches);
    const resultPlayerOfMatchEachSeason = sortAndExtractTopPlayer(
      playerOfMatchEachSeason
    );

    fs.writeFileSync(
      outputPath,
      JSON.stringify(resultPlayerOfMatchEachSeason, null, 2)
    );
  });
