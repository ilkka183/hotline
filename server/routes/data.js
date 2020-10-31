const express = require('express');
const connection = require('../connection');
const asyncMiddleware = require('../middleware/async');

const router = express.Router();


router.get('/makes', asyncMiddleware(async (req, res) => {
  const sql =
    'SELECT DISTINCT make.Name FROM model, make ' +
    'WHERE model.MakeId = make.Id ' +
    'ORDER BY make.Name';

  const { results } = await connection.query(sql);

  const list = results.map(item => item.Name);
  console.log(list);

  res.send(list);
}));


router.get('/modelYears', asyncMiddleware(async (req, res) => {
  const make = req.query.make;

  const sql =
    'SELECT MIN(model.StartYear) AS StartYear, MAX(model.EndYear) AS EndYear FROM model, make ' +
    'WHERE model.MakeId = make.Id ' +
    'AND make.Name = "' + make + '"';

  const { results } = await connection.query(sql);

  const date = new Date();
  const endYear = date.getFullYear();

  const result = results[0];

  const list = [];

  for (let year = endYear; year >= result.StartYear; year--)
    list.push(year);

  res.send(list);
}));


router.get('/fuelTypes', asyncMiddleware(async (req, res) => {
  const make = req.query.make;
  const modelYear = req.query.modelYear;

  const sql =
    'SELECT DISTINCT model.FuelType FROM model, make ' +
    'WHERE model.MakeId = make.Id ' +
    'AND make.Name = "' + make + '" ' +
    'AND model.StartYear <= ' + modelYear + ' ' +
    'AND (model.EndYear >= ' + modelYear + ' OR model.EndYear IS NULL) ' +
    'ORDER BY model.FuelType';

  const { results } = await connection.query(sql);

  const list = results.map(item => item.FuelType);

  res.send(list);
}));


router.get('/models', asyncMiddleware(async (req, res) => {
  const make = req.query.make;
  const modelYear = req.query.modelYear;
  const fuelType = req.query.fuelType;

  const sql =
    'SELECT DISTINCT model.Name FROM model, make ' +
    'WHERE model.MakeId = make.Id ' +
    'AND make.Name = "' + make + '" ' +
    'AND model.StartYear <= ' + modelYear + ' ' +
    'AND (model.EndYear >= ' + modelYear + ' OR model.EndYear IS NULL) ' +
    'AND model.FuelType = ' + fuelType + ' ' +
    'ORDER BY model.Name';

  const { results } = await connection.query(sql);

  const list = results.map(item => item.Name);

  res.send(list);
}));


router.get('/engineSizes', asyncMiddleware(async (req, res) => {
  const make = req.query.make;
  const modelYear = req.query.modelYear;
  const fuelType = req.query.fuelType;
  const model = req.query.model;

  const sql =
    'SELECT DISTINCT model.EngineSize FROM model, make ' +
    'WHERE model.MakeId = make.Id ' +
    'AND make.Name = "' + make + '" ' +
    'AND model.StartYear <= ' + modelYear + ' ' +
    'AND (model.EndYear >= ' + modelYear + ' OR model.EndYear IS NULL) ' +
    'AND model.FuelType = ' + fuelType + ' ' +
    'AND model.Name = "' + model + '" ' +
    'ORDER BY model.EngineSize';

  const { results } = await connection.query(sql);

  const list = results.map(item => item.EngineSize);

  res.send(list);
}));


router.get('/engineTypes', asyncMiddleware(async (req, res) => {
  const make = req.query.make;
  const modelYear = req.query.modelYear;
  const fuelType = req.query.fuelType;
  const model = req.query.model;
  const engineSize = req.query.engineSize;

  const sql =
    'SELECT model.EnginePower, model.EngineCode FROM model, make ' +
    'WHERE model.MakeId = make.Id ' +
    'AND make.Name = "' + make + '" ' +
    'AND model.StartYear <= ' + modelYear + ' ' +
    'AND (model.EndYear >= ' + modelYear + ' OR model.EndYear IS NULL) ' +
    'AND model.FuelType = ' + fuelType + ' ' +
    'AND model.Name = "' + model + '" ' +
    'AND model.EngineSize = ' + engineSize + ' ' +
    'ORDER BY model.EnginePower, model.EngineCode';

  const { results } = await connection.query(sql);

  const list = results.map(item => ({ power: item.EnginePower, code: item.EngineCode }));

  res.send(list);
}));


module.exports = router;
