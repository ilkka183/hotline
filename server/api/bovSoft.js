const axios = require('axios');
const utils = require('./utils');

async function parse(registrationNumber, response) {
  const data = response.data;

  if (data.datacar.length === 0)
    return null;

  const car = data.datacar[0];

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

  return vehicle;
}

async function getApi(registrationNumber) {
  const id = 55;
  const seccode = '43fc50aaeef3dfc95caebb365b974d55';
  
  const url =
    'http://webservice.bovsoft.com:150/bovsoft.regnum.run' +
    '?id=' + id +
    '&seccode=' + seccode +
    '&nameservice=getktypefornumplatefinland' +
    '&regnum=' + registrationNumber +
    '&contenttype=JSON';

  const { data } = await axios.get(url);
  return parse(registrationNumber, data);
}

async function getFile(registrationNumber) {
  const raw = await utils.readFile('./api/BovSoft/' + registrationNumber + '.json');
  const data = JSON.parse(raw);
  return parse(registrationNumber, data);
}

module.exports = { getApi, getFile };
