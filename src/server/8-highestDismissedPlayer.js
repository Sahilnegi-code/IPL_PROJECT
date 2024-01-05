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
    for (let matchesDetails in matches) {
      if (matches[matchesDetails].player_dismissed === "") {
        continue;
      }
      let dismissedPlayer = matches[matchesDetails].player_dismissed;
      highestDismissedPlayer[dismissedPlayer] =
        (highestDismissedPlayer[dismissedPlayer] || 0) + 1;
    }
    fs.writeFileSync(
      outputPath,
      JSON.stringify(highestDismissedPlayer, null, 2)
    );
  });
