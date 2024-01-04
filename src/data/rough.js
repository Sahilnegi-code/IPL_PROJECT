const csvtojson = require('csvtojson');
const fs = require('fs');

// Path to the CSV file
const csvFilePath = 'deliveries.csv';

// Path to the output JSON file
const jsonFilePath = 'deliveries.json';

// Convert CSV to JSON
csvtojson()
  .fromFile(csvFilePath)
  .then((jsonArray) => {
    // Save the JSON data to a file
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 2));
    console.log('Conversion complete. JSON file saved at', jsonFilePath);
  })
  .catch((error) => {
    console.error('Error converting CSV to JSON:', error.message);
  });
