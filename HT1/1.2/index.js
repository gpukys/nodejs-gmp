const csv = require('csvtojson');
const fs = require('fs');
const {pipeline} = require('stream');

const readStream = fs.createReadStream('./data.csv');
const writeStream = fs.createWriteStream('./result.json');

pipeline(
  readStream,
  csv(),
  writeStream,
  (error) => {
    if (error) {
      console.error(error);
    }
  }
)