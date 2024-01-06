const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const matches = [];
let highestDismissedPlayer = {};
let outputPath = path.join(
  __dirname,
  "..",
  "public",
  "output",
  "highestDismissedPlayer.json"
);

fs.createReadStream("../data/deliveries.csv")
  .pipe(csv())
  .on("data", (data) => matches.push(data))
  .on("end", () => {
    // for (let matchesDetails in matches) {
    //   if (matches[matchesDetails].player_dismissed === "") {
    //     continue;
    //   }
    //   let dismissedPlayer = matches[matchesDetails].player_dismissed;
    //   highestDismissedPlayer[dismissedPlayer] =
    //     (highestDismissedPlayer[dismissedPlayer] || 0) + 1;
    // }
    // let arrayResult = Object.entries(highestDismissedPlayer);
    // arrayResult.sort((player1, player2) => {
    //   if (Number(player1[1]) > Number(player2[1])) return -1;
    //   return 0;
    // });
    const filterDismissedPlayers = (matches) => {
      const matchDetails = matches.filter((match) => {
        if (match.player_dismissed !== "") {
          return true;
        }
        return false;
      });
      return matchDetails;
    };

    const countDismissedPlayers = (dismissedPlayers) => {
      const objDismissedPlayer = dismissedPlayers.reduce(
        (highestDismissedPlayer, match) => {
          const dismissedPlayer = match.player_dismissed;
          highestDismissedPlayer[dismissedPlayer] =
            (highestDismissedPlayer[dismissedPlayer] || 0) + 1;
          return highestDismissedPlayer;
        },
        {}
      );

      return objDismissedPlayer;
    };

    const sortDismissedPlayers = (highestDismissedPlayer) => {
      const highestdismissedPlayerArray = Object.entries(
        highestDismissedPlayer
      ).sort((player1, player2) => player2[1] - player1[1]);
      return highestdismissedPlayerArray;
    };

    const matchesDetails = matches;
    const dismissedPlayers = filterDismissedPlayers(matchesDetails);
    const highestDismissedPlayer = countDismissedPlayers(dismissedPlayers);
    const resulthighestDismissedPlayer = sortDismissedPlayers(
      highestDismissedPlayer
    );

    fs.writeFileSync(
      outputPath,
      JSON.stringify(resulthighestDismissedPlayer[0][0], null, 2)
    );
  });
