const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const deliveries = [];
let wonTossAndMatchFreq = {};
let outputPath = path.join(
  __dirname,
  "..",
  "public",
  "output",
  "wonTossAndMatch.json"
);
// Find the number of times each team won the toss and also won the match

fs.createReadStream("../data/matches.csv")
  .pipe(csv())
  .on("data", (data) => deliveries.push(data))
  .on("end", () => {
    // Function to process match information and update the frequency object
    const processMatchInfo = (deliveries, frequencyObj, key) => {
      deliveries.forEach((objInform) => {
        // Extract the value for the specified key (winner or toss_winner)
        const wonTeam = objInform[key];

        // Check if the team is not a property in the frequency object
        if (frequencyObj.hasOwnProperty(wonTeam) === false) {
          const tempfreq = {};
          // Increment the count for the specified key (winner or toss_winner)
          tempfreq[key] = (tempfreq[wonTeam] || 0) + 1;
          frequencyObj[wonTeam] = tempfreq;
        } else {
          // If the team is already a property, update the count for the specified key
          const tempFreq = frequencyObj[wonTeam];
          tempFreq[key] = (tempFreq[key] || 0) + 1;
        }
      });
    };

    // Initialize an object to store the frequency of winners and toss winners
    const wonTossAndMatchFreq = {};

    // Process match information for the 'winner' key
    processMatchInfo(deliveries, wonTossAndMatchFreq, "winner");

    // Process match information for the 'toss_winner' key
    processMatchInfo(deliveries, wonTossAndMatchFreq, "toss_winner");

    fs.writeFileSync(outputPath, JSON.stringify(wonTossAndMatchFreq, null, 2));
  });
