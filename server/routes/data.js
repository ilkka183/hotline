const express = require('express');
const connection = require('../connection');

const router = express.Router();


router.get('/makes', (req, res) => {
  const sql =
    'SELECT DISTINCT Make.Name FROM Model, Make ' +
    'WHERE Model.MakeId = Make.Id ' +
    'ORDER BY Make.Name';

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.log(error);        
      return res.status(400).send(error);
    }

    const list = results.map(item => item.Name);

    res.send(list);
  });
});


router.get('/modelYears', (req, res) => {
  const make = req.query.make;

  const sql =
    'SELECT MIN(Model.BeginYear) AS BeginYear, MAX(Model.EndYear) AS EndYear FROM Model, Make ' +
    'WHERE Model.MakeId = Make.Id ' +
    'AND Make.Name = "' + make + '"';

  console.log(sql);

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.log(error);        
      return res.status(400).send(error);
    }

    const date = new Date();
    const endYear = date.getFullYear();

    const result = results[0];

    const list = [];

    for (let year = endYear; year >= result.BeginYear; year--)
      list.push(year);

    res.send(list);
  });
});


router.get('/fuelTypes', (req, res) => {
  const make = req.query.make;
  const modelYear = req.query.modelYear;

  const sql =
    'SELECT DISTINCT Model.FuelType FROM Model, Make ' +
    'WHERE Model.MakeId = Make.Id ' +
    'AND Make.Name = "' + make + '" ' +
    'AND Model.BeginYear <= ' + modelYear + ' ' +
    'AND (Model.EndYear >= ' + modelYear + ' OR Model.EndYear IS NULL) ' +
    'ORDER BY Model.FuelType';

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.log(error);        
      return res.status(400).send(error);
    }

    const list = results.map(item => item.FuelType);

    res.send(list);
  });
});


router.get('/models', (req, res) => {
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

  console.log(sql);

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.log(error);        
      return res.status(400).send(error);
    }

    const list = results.map(item => item.Name);

    res.send(list);
  });
});


router.get('/engineSizes', (req, res) => {
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

  console.log(sql);

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.log(error);        
      return res.status(400).send(error);
    }

    const list = results.map(item => item.EngineSize);

    res.send(list);
  });
});


router.get('/engineTypes', (req, res) => {
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

  console.log(sql);

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.log(error);        
      return res.status(400).send(error);
    }

    const list = results.map(item => ({ power: item.EnginePower, code: item.EngineCode }));

    res.send(list);
  });
});


module.exports = router;
