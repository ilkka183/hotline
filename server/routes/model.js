const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const power = require('../middleware/power');
const asyncMiddleware = require('../middleware/async');

const router = express.Router();

const table = 'model';

const sql = 
  'SELECT model.Id, model.MakeId, make.Name AS MakeName, model.Name, model.Grouping, model.AdditionalInfo, model.Sequence, ' +
  'model.StartYear, model.EndYear, model.FuelType, model.VehicleType, model.Tune, ' +
  'model.EngineSize, model.CylinderCount, model.EnginePower, model.EnginePowerAt, model.EngineCode, model.MID, ' +
  'model.Enabled, model.InsertedAt, model.UpdatedAt ' +
  'FROM model, make ' +
  'WHERE model.MakeId = make.Id';

router.get('', asyncMiddleware(async (req, res) => { await http.getRows(req, res, sql) }));
router.get('/:Id', asyncMiddleware(async (req, res) => { await http.getRow(req, res, http.sql(table, req.params.Id)) }));
router.post('', [auth, power], asyncMiddleware(async (req, res) => { await http.postRow(req, res, table) }));
router.put('/:Id', [auth, power], asyncMiddleware(async (req, res) => { await http.putRow(req, res, table, { Id: req.params.Id }) }));
router.delete('/:Id', [auth, power], asyncMiddleware(async (req, res) => { await http.deleteRow(req, res, table, { Id: req.params.Id }) }));

module.exports = router;
