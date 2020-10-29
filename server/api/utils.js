const fs = require('fs');
const xml2js = require('xml2js');

async function readFile(path) {
  const promise = await new Promise((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (error)
        reject(error);
      else
        resolve(data);
    });
  });
  
  return promise;
}

async function parseXml(data) {
  const promise = await new Promise((resolve, reject) => {
    const parser = new xml2js.Parser();

    parser.parseString(data, (error, result) => {
      if (error)
        reject(error);
      else
        resolve(result);
    });
  });
  
  return promise;
}

module.exports = { readFile, parseXml };
