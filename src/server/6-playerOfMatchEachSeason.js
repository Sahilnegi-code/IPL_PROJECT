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
    // Initialize an object to store the player of the match for each season
    let playerOfMatchEachSeason = {};

    // Iterate through each object in the 'matches' array
    for (let objInform of matches) {
      // Check if the current season is not a property in 'playerOfMatchEachSeason' object
      if (playerOfMatchEachSeason.hasOwnProperty(objInform.season) === false) {
        // If not, create a new array to store player-of-the-match information for the season
        let players2DArray = [];
        let playersArray = [];
        playersArray.push(1); // Count of appearances
        playersArray.push(objInform.player_of_match);
        players2DArray.push(playersArray);
        playerOfMatchEachSeason[objInform.season] = players2DArray;
      } else {
        // If the season already exists, update the player-of-the-match count for the season
        let arrayOfSeason = playerOfMatchEachSeason[objInform.season];
        let hasPlayer = false;

        // Iterate through each player-of-the-match entry in the season
        for (let player of arrayOfSeason) {
          // Check if the player-of-the-match already exists for the current season
          if (player[1] === objInform.player_of_match) {
            // If yes, increment the count
            player[0]++;
            hasPlayer = true;
          }
        }

        // If the player-of-the-match doesn't exist for the current season, add a new entry
        if (hasPlayer === false) {
          let playersArray = [];
          playersArray.push(1); // Count of appearances
          playersArray.push(objInform.player_of_match);
          arrayOfSeason = [...arrayOfSeason, playersArray];
          playerOfMatchEachSeason[objInform.season] = arrayOfSeason;
        }
      }
    }

    // Sort each season's player-of-the-match entries based on the count of appearances
    for (let year in playerOfMatchEachSeason) {
      let season = playerOfMatchEachSeason[year];
      season.sort((season1, season2) => {
        if (season1[0] > season2[0]) {
          return -1;
        }
        return 1;
      });
    }

    // Create an object to store the player of the match for each season with the highest count of appearances
    let resultPlayerOfMatchEachSeason = {};
    for (let year in playerOfMatchEachSeason) {
      resultPlayerOfMatchEachSeason[year] = playerOfMatchEachSeason[year][0][1];
    }

    try {
      fs.writeFileSync(
        outputPath,
        JSON.stringify(resultPlayerOfMatchEachSeason, null, 2)
      );
    } catch {
      console.log("File is not created .");
    }
  });
