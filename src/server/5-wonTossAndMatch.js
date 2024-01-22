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
    // Iterate through each object in the 'deliveries' array
for (let objInform of deliveries) {
  // Get the winning team and toss-winning team for the current match
  let wonTeam = objInform.winner;
  let wonToss = objInform.toss_winner;

  // Check if the winning team is not a property in 'wonTossAndMatchFreq' object
  if (wonTossAndMatchFreq.hasOwnProperty(wonTeam) === false) {
    // If not, create a new object to store the frequency of winning and initialize the count to 1
    let tempfreq = {};
    tempfreq.winner = (tempfreq[wonTeam] || 0) + 1;
    wonTossAndMatchFreq[wonTeam] = tempfreq;
  } else {
    // If the winning team is already a property, update the count
    let tempFreq = wonTossAndMatchFreq[wonTeam];
    tempFreq.winner = (tempFreq.winner || 0) + 1;
  }

  // Check if the toss-winning team is not a property in 'wonTossAndMatchFreq' object
  if (wonTossAndMatchFreq.hasOwnProperty(wonToss) === false) {
    // If not, create a new object to store the frequency of winning the toss and initialize the count to 1
    let tempfreq = {};
    tempfreq[wonToss] = (tempfreq[wonToss] || 0) + 1;
  } else {
    // If the toss-winning team is already a property, update the count
    let tempFreq = wonTossAndMatchFreq[wonToss];
    tempFreq.toss_winner = (tempFreq.toss_winner || 0) + 1;
  }
}

    fs.writeFileSync(outputPath, JSON.stringify(wonTossAndMatchFreq, null, 2));
  });