const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const results = [];

let outputPath = path.join(__dirname, "..", "public", "sahil.json");

fs.createReadStream("../data/matches.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {});
