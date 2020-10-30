const axios = require('axios');
const config = require('config');
const utils = require('./utils');

async function parse(registrationNumber, response) {
  const xml = await utils.parseXml(response);
  const data = JSON.parse(xml.Vehicle.vehicleJson);

  const vehicle = {
    registrationNumber
  }

  if (data.CarMake.CurrentTextValue)
    vehicle.carMake = data.CarMake.CurrentTextValue;

  if (data.CarModel.CurrentTextValue)
    vehicle.carModel = data.CarModel.CurrentTextValue;

  if (data.EngineSize.CurrentTextValue)
    vehicle.engineSize = data.EngineSize.CurrentTextValue;

  if (data.FuelType.CurrentTextValue)
    vehicle.fuelType = data.FuelType.CurrentTextValue;

  if (data.EngineCode)
    vehicle.engineCode = data.EngineCode;

  if (data.Power)
    vehicle.power = data.Power;

  if (data.VechileIdentificationNumber)
    vehicle.vin = data.VechileIdentificationNumber;

  if (data.NetWeight)
    vehicle.netWeight = data.NetWeight;

  return vehicle;
}

async function getApi(registrationNumber) {
  const username = config.get('regcheck.username');

  const url =
    'https://www.regcheck.org.uk/api/reg.asmx/CheckFinland' +
    '?RegistrationNumber=' + registrationNumber +
    '&username=' + username;

  const { data } = await axios.get(url);
  return await parse(registrationNumber, data);
}

async function getFile(registrationNumber) {
  const data = await utils.readFile('./api/RegCheck/' + registrationNumber + '.xml');
  return await parse(registrationNumber, data);
}

module.exports = { getApi, getFile };
