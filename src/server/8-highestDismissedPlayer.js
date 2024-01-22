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
   // Initialize an object to store the count of dismissals for each player
let highestDismissedPlayer = {};

// Iterate through each match in the 'matches' array
for (let matchesDetails in matches) {
  // Check if the player_dismissed field is empty
  if (matches[matchesDetails].player_dismissed === "") {
    // If empty, skip to the next iteration
    continue;
  }

  // Get the dismissed player from the current match
  let dismissedPlayer = matches[matchesDetails].player_dismissed;

  // Update the count of dismissals for the dismissed player
  highestDismissedPlayer[dismissedPlayer] =
    (highestDismissedPlayer[dismissedPlayer] || 0) + 1;
}

// Convert the object into an array of [player, dismissal count] pairs
let arrayResult = Object.entries(highestDismissedPlayer);

// Sort the array based on the dismissal count in descending order
arrayResult.sort((player1, player2) => {
  if (Number(player1[1]) > Number(player2[1])) return -1;
  return 0;
});

  try{
    fs.writeFileSync(outputPath, JSON.stringify(arrayResult[0][0], null, 2));
  } catch {
    console.log("File is not Created ");
  }
  });