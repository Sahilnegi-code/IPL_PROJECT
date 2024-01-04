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
    let obj = {};
    for( let keys in matchesObj){
        obj[matchesObj[keys].season] = (obj[matchesObj[keys].season] || 0 ) +1
    }
    return obj;
}

