const fs = require('fs');
const path = require('path')
const csv = require('csv-parser')
const results = [];
let  outputPath = path.join(__dirname , '..',"public", "output","matchesWonPerTeamPerYear.json");

fs.createReadStream('../data/matches.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    let result = numberOfMatchesPerTeamPerYear(results);

    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

  });
  
// give the output of numberOfMatchesPerTeamPerYear  
const numberOfMatchesPerTeamPerYear = (matchesDetailsInformation) =>{
    
    let objNumberOfMatchesPerTeamPerYear = {};

    for( let key in  matchesDetailsInformation  ){
        let matchesDetails= matchesDetailsInformation[key];
        if(  !objNumberOfMatchesPerTeamPerYear.hasOwnProperty(matchesDetails.season) ){
            let noOfMatchesTeamPlayed = {};

            noOfMatchesTeamPlayed[matchesDetails.team1] = 1;

            noOfMatchesTeamPlayed[matchesDetails.team2] = 1;

            objNumberOfMatchesPerTeamPerYear[matchesDetails.season] = noOfMatchesTeamPlayed;

        }else{

          let details = objNumberOfMatchesPerTeamPerYear[matchesDetails.season];

          let team1 = matchesDetails.team1;

          let team2 = matchesDetails.team2;

          if(details.hasOwnProperty(team1)) {
            details[team1] = details[team1]  + 1
          }
          else{
            details[team1] = 1;
          }

          if(details.hasOwnProperty(team2)){
            details[team2] = details[team2] +1;
          }
          else{
            details[team2] = 1;
          }
          objNumberOfMatchesPerTeamPerYear[ matchesDetailsInformation.season  ] =  details;
        }
    }

return objNumberOfMatchesPerTeamPerYear;
};

