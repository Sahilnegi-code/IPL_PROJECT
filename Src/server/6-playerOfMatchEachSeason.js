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
    // Function to process information about the player of the match
    const processPlayerOfMatch = (matches) => {
      // Use reduce to iterate through the matches and accumulate player of the match data
      let playerOfMatchArray = matches.reduce(
        (playerOfMatchEachSeason, objInform) => {
          const season = objInform.season;

          // Check if the season is not a property in the accumulator object
          if (playerOfMatchEachSeason.hasOwnProperty(season) === false) {
            // If not, initialize the season with an array containing the first player of the match
            playerOfMatchEachSeason[season] = [[1, objInform.player_of_match]];
          } else {
            // If the season is already a property, update the array with player of the match information
            const arrayOfSeason = playerOfMatchEachSeason[season];
            const index = arrayOfSeason.findIndex(
              (player) => player[1] === objInform.player_of_match
            );

            // Check if the player of the match is already in the array for the season
            if (index !== -1) {
              arrayOfSeason[index][0]++;
            } else {
              // If not, add a new entry for the player of the match
              arrayOfSeason.push([1, objInform.player_of_match]);
            }
          }

          return playerOfMatchEachSeason;
        },
        {}
      );

      return playerOfMatchArray;
    };

    // Function to sort and extract the top player of the match for each season
    const sortAndExtractTopPlayer = (playerOfMatchEachSeason) => {
      const result = {};
      for (let year in playerOfMatchEachSeason) {
        const season = playerOfMatchEachSeason[year];
        // Sort the array for the season based on the count of player of the match in descending order
        season.sort((season1, season2) => season2[0] - season1[0]);
        // Extract the top player of the match for the season
        result[year] = season[0][1];
      }
      return result;
    };

    // Process information about the player of the match for each season
    const playerOfMatchEachSeason = processPlayerOfMatch(matches);

    // Sort and extract the top player of the match for each season
    const resultPlayerOfMatchEachSeason = sortAndExtractTopPlayer(
      playerOfMatchEachSeason
    );

    fs.writeFileSync(
      outputPath,
      JSON.stringify(resultPlayerOfMatchEachSeason, null, 2)
    );
  });
