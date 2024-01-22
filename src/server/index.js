// index.js

const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const cors = require("cors");
app.use(cors());
// app.use(express.static(path.join(__dirname, "public")));

// Define a route
app.post("/output/matchesPerYear", (req, res) => {
  console.log(req.url);
  const matchesPerYear = require(path.join(
    __dirname,
    `../public${req.url}.js`
  ));
  console.log(matchesPerYear);
  res.json(matchesPerYear);
});
app.get("/:data", (req, res) => {
  const { data } = req.params;
  console.log(data);
  const htmlFile = path.join(__dirname, `../public/${req.url}.html`);
  console.log(htmlFile);
  res.sendFile(htmlFile);
});

app.post("/output/matchesWonPerTeamPerYear", (req, res) => {
  console.log(req.url);
  const matchesPerYear = require(path.join(
    __dirname,
    `../public${req.url}.js`
  ));
  console.log(matchesPerYear);
  res.json(matchesPerYear);
});

app.post("/output/top10EconomicBowler", (req, res) => {
  let data = require(path.join(__dirname, `../public${req.url}.js`));
  console.log(data);
  res.json(data);
});
app.post("/output/bowlersBestEconomyInSuperOver", (req, res) => {
  let data = require(path.join(__dirname, `../public${req.url}.js`));

  console.log("Sahil --> ", data);
  res.json(data);
});
app.post("/output/extraRunsPerTeam", (req, res) => {
  let data = require(path.join(__dirname, `../public${req.url}.js`));

  console.log("Sahil --> ", data);
  res.json(data);
});

app.post("/output/highestDismissedPlayer", (req, res) => {
  let data = require(path.join(__dirname, `../public${req.url}.js`));

  console.log("Sahil --> ", data);
  res.json(data);
});
app.post("/output/strikeRateOfEachSeason", (req, res) => {
  let data = require(path.join(__dirname, `../public${req.url}.js`));
  res.json(data);
});
app.post("/output/wonTossAndMatch", (req, res) => {
  let data = require(path.join(__dirname, `../public${req.url}.js`));
  res.json(data);
});
app.post("/output/playerOfMatchEachSeason", (req, res) => {
  let data = require(path.join(__dirname, `../public${req.url}.js`));
  res.json(data);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
