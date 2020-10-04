const express = require('express');
const connection = require('../connection');

const router = express.Router();


router.get('/makes', async (req, res) => {
  const sql =
    'SELECT DISTINCT make.Name FROM model, make ' +
    'WHERE model.MakeId = make.Id ' +
    'ORDER BY make.Name';

  try {
    const { results } = await connection.query(sql);

    const list = results.map(item => item.Name);
    console.log(list);

    res.send(list);
  }
  catch (ex) {
    console.error(ex);
    res.status(500).send(ex);
  }
});


router.get('/modelYears', async (req, res) => {
  const make = req.query.make;

  const sql =
    'SELECT MIN(model.StartYear) AS StartYear, MAX(model.EndYear) AS EndYear FROM model, make ' +
    'WHERE model.MakeId = make.Id ' +
    'AND make.Name = "' + make + '"';

  try {
    const { results } = await connection.query(sql);

    const date = new Date();
    const endYear = date.getFullYear();

    const result = results[0];

    const list = [];

    for (let year = endYear; year >= result.StartYear; year--)
      list.push(year);

    res.send(list);
  }
  catch (ex) {
    console.error(ex);
    res.status(500).send(ex);
  }
});


router.get('/fuelTypes', async (req, res) => {
  const make = req.query.make;
  const modelYear = req.query.modelYear;

  const sql =
    'SELECT DISTINCT model.FuelType FROM model, make ' +
    'WHERE model.MakeId = make.Id ' +
    'AND make.Name = "' + make + '" ' +
    'AND model.StartYear <= ' + modelYear + ' ' +
    'AND (model.EndYear >= ' + modelYear + ' OR model.EndYear IS NULL) ' +
    'ORDER BY model.FuelType';

  try {
    const { results } = await connection.query(sql);

    const list = results.map(item => item.FuelType);

    res.send(list);
  }
  catch (ex) {
    console.error(ex);
    res.status(500).send(ex);
  }
});


router.get('/models', async (req, res) => {
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

  try {
    const { results } = await connection.query(sql);

    const list = results.map(item => item.Name);

    res.send(list);
  }
  catch (ex) {
    console.error(ex);
    res.status(500).send(ex);
  }
});


router.get('/engineSizes', async (req, res) => {
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

  try {
    const { results } = await connection.query(sql);

    const list = results.map(item => item.EngineSize);

    res.send(list);
  }
  catch (ex) {
    console.error(ex);
    res.status(500).send(ex);
  }
});


router.get('/engineTypes', async (req, res) => {
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

  try {
    const { results } = await connection.query(sql);

    const list = results.map(item => ({ power: item.EnginePower, code: item.EngineCode }));

    res.send(list);
  }
  catch (ex) {
    console.error(ex);
    res.status(500).send(ex);
  }
});


module.exports = router;
