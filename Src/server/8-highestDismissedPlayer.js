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
    // Function to filter dismissed players from matches
    const filterDismissedPlayers = (matches) => {
      const matchDetails = matches.filter((match) => {
        // Check if the player was dismissed
        if (match.player_dismissed !== "") {
          return true;
        }
        return false;
      });
      return matchDetails;
    };

    // Function to count occurrences of dismissed players
    const countDismissedPlayers = (dismissedPlayers) => {
      const objDismissedPlayer = dismissedPlayers.reduce(
        (highestDismissedPlayer, match) => {
          const dismissedPlayer = match.player_dismissed;
          // Increment the count for the dismissed player
          highestDismissedPlayer[dismissedPlayer] =
            (highestDismissedPlayer[dismissedPlayer] || 0) + 1;
          return highestDismissedPlayer;
        },
        {}
      );

      return objDismissedPlayer;
    };

    // Function to sort dismissed players based on the count
    const sortDismissedPlayers = (highestDismissedPlayer) => {
      const highestdismissedPlayerArray = Object.entries(
        highestDismissedPlayer
      ).sort((player1, player2) => player2[1] - player1[1]);
      return highestdismissedPlayerArray;
    };

    // Copy the matches to a new variable
    const matchesDetails = matches;

    // Filter dismissed players from match details
    const dismissedPlayers = filterDismissedPlayers(matchesDetails);

    // Count occurrences of dismissed players
    const highestDismissedPlayer = countDismissedPlayers(dismissedPlayers);

    // Sort dismissed players based on the count
    const resulthighestDismissedPlayer = sortDismissedPlayers(
      highestDismissedPlayer
    );

    fs.writeFileSync(
      outputPath,
      JSON.stringify(resulthighestDismissedPlayer[0][0], null, 2)
    );
  });
