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

async function parseRegCheck(registrationNumber, raw) {
  const data = await parseXml(raw);
  const source = JSON.parse(data.Vehicle.vehicleJson);

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

async function getRegCheckApi(registrationNumber) {
  const url = 'https://www.regcheck.org.uk/api/reg.asmx/CheckFinland' +
    '?RegistrationNumber=' + registrationNumber +
    '&username=Ilkka183';

  const { data } = await axios.get(url);
  return await parseRegCheck(registrationNumber, data);
}

async function getRegCheckFile(registrationNumber) {
  const data = await readFile('./api/RegCheck/' + registrationNumber + '.xml');
  return await parseRegCheck(registrationNumber, data);
}

async function parseBovSoft(registrationNumber, response) {
  const data = response.data;

  if (data.datacar.length === 0)
    return null;

  const car = data.datacar[0];
  console.log(car);

  const vehicle = {
    registrationNumber
  }

  if (car.manufCar)
    vehicle.carMake = car.manufCar;

  if (car.modelCar)
    vehicle.carModel = car.modelCar;

  if (car.ccmCar)
    vehicle.engineSize = car.ccmCar;

  if (car.fuelSystem)
    vehicle.fuelType = car.fuelSystem;

  if (car.listEngines) {
    const codes = car.listEngines.split(';');

    if (codes.length > 0)
      vehicle.engineCode = codes[0];
  }

  if (car.kwCar)
    vehicle.power = car.kwCar;

  if (car.vin)
    vehicle.vin = car.vin;

  if (car.ktype)
    vehicle.ktype = car.ktype;

  console.log(vehicle);

  return vehicle;
}

async function getBovSoftApi(registrationNumber) {
  const id = 55;
  const seccode = '43fc50aaeef3dfc95caebb365b974d55';
  
  const url = 'http://webservice.bovsoft.com:150/bovsoft.regnum.run' +
    '?id=' + id +
    '&seccode=' + seccode +
    '&nameservice=getktypefornumplatefinland' +
    '&regnum=' + registrationNumber +
    '&contenttype=JSON';

  const { data } = await axios.get(url);
  return parseBovSoft(registrationNumber, data);
}

async function getBovSoftFile(registrationNumber) {
  const raw = await readFile('./api/BovSoft/' + registrationNumber + '.json');
  const data = JSON.parse(raw);  
  return parseBovSoft(registrationNumber, data);
}

async function getVehicle(registrationNumber, source) {
  switch (source) {
    case 'BovSoftApi': return await getBovSoftApi(registrationNumber);
    case 'BovSoftFile':  return await getBovSoftFile(registrationNumber);
    case 'RegCheckApi': return await getRegCheckApi(registrationNumber);
    case 'RegCheckFile':  return await getRegCheckFile(registrationNumber);
  }

  return getTest(registrationNumber);
}

router.get('/:registrationNumber', async (req, res) => {
  try {
    const vehicle = await getVehicle(req.params.registrationNumber, req.query.source);
    return res.send(vehicle);
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = router;
