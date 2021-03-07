const csv = require('csvtojson');
const fs = require('fs');

const readStream = fs.createReadStream('./data.csv');
const writeStream = fs.createWriteStream('./result.json');

readStream.pipe(csv()).pipe(writeStream);

