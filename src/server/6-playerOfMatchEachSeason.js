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
    let resultPlayerOfMatchEachSeason = {};

    for (let objInform of matches) {
      if (playerOfMatchEachSeason.hasOwnProperty(objInform.season) === false) {
        let players2DArray = [];
        let playersArray = [];
        playersArray.push(1);
        playersArray.push(objInform.player_of_match);
        players2DArray.push(playersArray);
        playerOfMatchEachSeason[objInform.season] = players2DArray;
      } else {
        let arrayOfSeason = playerOfMatchEachSeason[objInform.season];
        console.log(arrayOfSeason);
        let hasPlayer = false;
        for (let player of arrayOfSeason) {
          if (player[1] === objInform.player_of_match) {
            player[0]++;
            hasPlayer = true;
          }
        }
        if (hasPlayer === false) {
          let playersArray = [];
          playersArray.push(1);
          playersArray.push(objInform.player_of_match);
          arrayOfSeason = [...arrayOfSeason, playersArray];
          // console.log(arrayOfSeason);
          playerOfMatchEachSeason[objInform.season] = arrayOfSeason;
        }
      }
    }

    for (let year in playerOfMatchEachSeason) {
      let season = playerOfMatchEachSeason[year];
      season.sort((season1, season2) => {
        if (season1[0] > season2[0]) {
          return -1;
        }

        return +1;
      });
    }

    for (let year in playerOfMatchEachSeason) {
      resultPlayerOfMatchEachSeason[year] = playerOfMatchEachSeason[year][0][1];
    }
    fs.writeFileSync(
      outputPath,
      JSON.stringify(resultPlayerOfMatchEachSeason, null, 2)
    );
  });
