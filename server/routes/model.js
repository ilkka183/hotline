const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const power = require('../middleware/power');

const router = express.Router();

const table = 'Model';

const sql = 
  'SELECT Model.Id, Model.MakeId, Make.Name AS MakeName, Model.Name, Model.BeginYear, Model.EndYear, Model.FuelType, ' +
  'Model.EngineSize, Model.CylinderCount, Model.Power, Model.EngineCode, Model.MID, Model.Enabled ' +
  'FROM Model, Make ' +
  'WHERE Model.MakeId = Make.Id ' +
  'ORDER BY Make.Name, Model.Name, Model.Power';

router.get('', (req, res) => { http.getRows(req, res, sql) });
router.get('/:Id', (req, res) => { http.getRow(req, res, http.sql(table, req.params.Id)) });
router.post('', [auth, power], (req, res) => { http.postRow(req, res, table) });
router.put('/:Id', [auth, power], (req, res) => { http.putRow(req, res, table, { Id: req.params.Id }) });
router.delete('/:Id', [auth, power], (req, res) => { http.deleteRow(req, res, table, { Id: req.params.Id }) });

module.exports = router;
