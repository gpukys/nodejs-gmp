import csv from 'csvtojson';
import fs from 'fs';
import { pipeline } from 'stream';

const pathToCsv = './data.csv';
const pathToResult = './result.json';
const readStream = fs.createReadStream(pathToCsv);
const writeStream = fs.createWriteStream(pathToResult);

switch (process.argv[2]) {
  case '--all':
    parseAll();
  default:
    parseLineByLine();
}

function parseLineByLine() {
  pipeline(readStream, csv(), writeStream, (error) => {
    if (error) {
      console.error(error);
    }
  });
}

function parseAll() {
  csv()
    .fromFile(pathToCsv)
    .then((jsonObj) => {
      writeStream.write(jsonObj.toString());
    });
}
