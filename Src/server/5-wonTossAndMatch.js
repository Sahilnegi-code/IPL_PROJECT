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

    const processMatchInfo = (deliveries, frequencyObj, key) => {
      deliveries.forEach(objInform => {
        const wonTeam = objInform[key];
        if (frequencyObj.hasOwnProperty(wonTeam) === false) {
          const tempfreq = {};
          tempfreq[key] = (tempfreq[wonTeam] || 0) + 1;
          frequencyObj[wonTeam] = tempfreq;
        } else {
          const tempFreq = frequencyObj[wonTeam];
          tempFreq[key] = (tempFreq[key] || 0) + 1;
        }
      });
    };
    
    const wonTossAndMatchFreq = {};
    
    processMatchInfo(deliveries, wonTossAndMatchFreq, 'winner');
    processMatchInfo(deliveries, wonTossAndMatchFreq, 'toss_winner');

    fs.writeFileSync(outputPath, JSON.stringify(wonTossAndMatchFreq, null, 2));
  });
