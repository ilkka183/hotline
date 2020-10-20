const express = require('express');
const fs = require('fs');
const xml2js = require('xml2js');
const axios = require('axios');

const router = express.Router();


const vehicles = [
  {
    registrationNumber: 'ZLP-833',
    registrationYear: 2017,
    carMake: 'Seat',
    carModel: 'Leon ST',
    fuelType: 'bensiini',
    cylinderCount: 3,
    engineSize: 999,
    power: 85,
    engineCode: 'CHZD',
    vechileIdentificationNumber: 'VSSZZZ5FZHR046587',
    netWeight: 1236,
    grossWeight: 1770
  },
  {
    registrationNumber: 'ISI-561',
    registrationYear: 2005,
    carMake: 'VW',
    carModel: 'Golf',
    fuelType: 'bensiini',
    cylinderCount: 4,
    engineSize: 1596,
    power: 74,
    engineCode: 'CHZD',
    vechileIdentificationNumber: 'WF0WXXGCDW5B88909',
    netWeight: 1277,
    grossWeight: 1770
  },
  {
    registrationNumber: 'SIO-913',
    registrationYear: 1999,
    carMake: 'Ford',
    carModel: 'Focus',
    fuelType: 'diesel',
    cylinderCount: 4,
    engineSize: 1769,
    power: 66,
    engineCode: 'HWDA',
    vechileIdentificationNumber: 'WVWZZZ1JZ5W079439',
    netWeight: 1415,
    grossWeight: 1770
  }
];

function getTest(registrationNumber) {
  for (const vehicle of vehicles)
    if (vehicle.registrationNumber === registrationNumber)
      return vehicle;

  throw 'Registration number not found';
}

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

async function getJson(registrationNumber, raw) {
  const data = await parseXml(raw);
  const json = data.Vehicle.vehicleJson;
  const source = JSON.parse(json);

  const vehicle = {
    registrationNumber
  }

  if (source.CarMake.CurrentTextValue)
    vehicle.carMake = source.CarMake.CurrentTextValue;

  if (source.CarModel.CurrentTextValue)
    vehicle.carModel = source.CarModel.CurrentTextValue;

  if (source.EngineSize.CurrentTextValue)
    vehicle.engineSize = source.EngineSize.CurrentTextValue;

  if (source.FuelType.CurrentTextValue)
    vehicle.fuelType = source.FuelType.CurrentTextValue;

  if (source.EngineCode)
    vehicle.engineCode = source.EngineCode;

  if (source.Power)
    vehicle.power = source.Power;

  if (source.VechileIdentificationNumber)
    vehicle.vechileIdentificationNumber = source.VechileIdentificationNumber;

  if (source.NetWeight)
    vehicle.netWeight = source.NetWeight;

  return vehicle;
}

async function getApi(registrationNumber) {
  const host = 'https://www.regcheck.org.uk';
  const username = 'Ilkka183';
  
  const url = host + '/api/reg.asmx/CheckFinland?RegistrationNumber=' + registrationNumber + '&username=' + username;

  const { data } = await axios.get(url);
  return await getJson(registrationNumber, data);
}

async function getFile(registrationNumber) {
  const data = await readFile('./api/data.xml');
  return await getJson(registrationNumber, data);
}

async function getVehicle(registrationNumber, source) {
  console.log(source);

  switch (source) {
    case 'api': return await getApi(registrationNumber);
    case 'file':  return await getFile(registrationNumber);
  }

  return getTest(registrationNumber);
}

router.get('/:registrationNumber', async (req, res) => {
  try {
    const vehicle = await getVehicle(req.params.registrationNumber, req.query.source);
    console.log(vehicle);
    return res.send(vehicle);
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

module.exports = router;
