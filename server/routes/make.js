const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const power = require('../middleware/power');
const asyncMiddleware = require('../middleware/async');

const router = express.Router();

const table = 'make';

const sql = 
  'SELECT Id, Name, Info, Enabled, CreatedAt, UpdatedAt ' +
  'FROM make ' + 
  'ORDER BY name';

router.get('', asyncMiddleware(async (req, res) => { await http.getRows(req, res, sql) }));
router.get('/:Id', asyncMiddleware(async (req, res) => { await http.getRow(req, res, http.sql(table, req.params.Id)) }));
router.post('', [auth, power], asyncMiddleware(async (req, res) => { await http.postRow(req, res, table) }));
router.put('/:Id', [auth, power], asyncMiddleware(async (req, res) => { await http.putRow(req, res, table, { Id: req.params.Id }) }));
router.delete('/:Id', [auth, power], asyncMiddleware(async (req, res) => { await http.deleteRow(req, res, table, { Id: req.params.Id }) }));

module.exports = router;
