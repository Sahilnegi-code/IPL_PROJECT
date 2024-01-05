const fs = require('fs');
const path = require('path')
const csv = require('csv-parser')
const results = [];

let  outputPath = path.join(__dirname , '..',"public", "output","matchesPerYear.json");

fs.createReadStream('../data/matches.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    let result = matchesPerYear(results);
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

  });
  



const matchesPerYear  = (matchesObj) =>{
    // let obj = {};
    const obj = Object.values(matchesObj).reduce((accumulator, current) => {
      accumulator[current.season] = (accumulator[current.season] || 0) + 1;
      return accumulator;
  }, {});
    return obj;
}

