const express = require('express');
const connection = require('../connection');

const router = express.Router();


router.get('/makes', async (req, res) => {
  const sql =
    'SELECT DISTINCT Make.Name FROM Model, Make ' +
    'WHERE Model.MakeId = Make.Id ' +
    'ORDER BY Make.Name';

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


router.get('/modelYears', async (req, res) => {
  const make = req.query.make;

  const sql =
    'SELECT MIN(Model.BeginYear) AS BeginYear, MAX(Model.EndYear) AS EndYear FROM Model, Make ' +
    'WHERE Model.MakeId = Make.Id ' +
    'AND Make.Name = "' + make + '"';

  try {
    const { results } = await connection.query(sql);

    const date = new Date();
    const endYear = date.getFullYear();

    const result = results[0];

    const list = [];

    for (let year = endYear; year >= result.BeginYear; year--)
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
    'SELECT DISTINCT Model.FuelType FROM Model, Make ' +
    'WHERE Model.MakeId = Make.Id ' +
    'AND Make.Name = "' + make + '" ' +
    'AND Model.BeginYear <= ' + modelYear + ' ' +
    'AND (Model.EndYear >= ' + modelYear + ' OR Model.EndYear IS NULL) ' +
    'ORDER BY Model.FuelType';

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
    'SELECT DISTINCT Model.Name FROM Model, Make ' +
    'WHERE Model.MakeId = Make.Id ' +
    'AND Make.Name = "' + make + '" ' +
    'AND Model.BeginYear <= ' + modelYear + ' ' +
    'AND (Model.EndYear >= ' + modelYear + ' OR Model.EndYear IS NULL) ' +
    'AND Model.FuelType = ' + fuelType + ' ' +
    'ORDER BY Model.Name';

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
    'SELECT DISTINCT Model.EngineSize FROM Model, Make ' +
    'WHERE Model.MakeId = Make.Id ' +
    'AND Make.Name = "' + make + '" ' +
    'AND Model.BeginYear <= ' + modelYear + ' ' +
    'AND (Model.EndYear >= ' + modelYear + ' OR Model.EndYear IS NULL) ' +
    'AND Model.FuelType = ' + fuelType + ' ' +
    'AND Model.Name = "' + model + '" ' +
    'ORDER BY Model.EngineSize';

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
    'SELECT Model.EnginePower, Model.EngineCode FROM Model, Make ' +
    'WHERE Model.MakeId = Make.Id ' +
    'AND Make.Name = "' + make + '" ' +
    'AND Model.BeginYear <= ' + modelYear + ' ' +
    'AND (Model.EndYear >= ' + modelYear + ' OR Model.EndYear IS NULL) ' +
    'AND Model.FuelType = ' + fuelType + ' ' +
    'AND Model.Name = "' + model + '" ' +
    'AND Model.EngineSize = ' + engineSize + ' ' +
    'ORDER BY Model.EnginePower, Model.EngineCode';

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
