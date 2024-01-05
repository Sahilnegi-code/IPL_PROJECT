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
    for (let objInform of deliveries) {
      let wonTeam = objInform.winner;
      let wonToss = objInform.toss_winner;
      if (wonTossAndMatchFreq.hasOwnProperty(wonTeam) === false) {
        let tempfreq = {};
        tempfreq.winner = (tempfreq[wonTeam] || 0) + 1;
        wonTossAndMatchFreq[wonTeam] = tempfreq;
      } else {
        let tempFreq = wonTossAndMatchFreq[wonTeam];
        tempFreq.winner = (tempFreq.winner || 0) + 1;
      }

      if (wonTossAndMatchFreq.hasOwnProperty(wonToss) === false) {
        let tempfreq = {};
        tempfreq[wonToss] = (tempfreq[wonToss] || 0) + 1;
      } else {
        let tempFreq = wonTossAndMatchFreq[wonToss];
        tempFreq.toss_winner = (tempFreq.toss_winner || 0) + 1;
      }
    }
    fs.writeFileSync(outputPath, JSON.stringify(wonTossAndMatchFreq, null, 2));
  });
