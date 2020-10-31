const express = require('express');
const http = require('./methods');
const asyncMiddleware = require('../middleware/async');

const router = express.Router();

const table = 'systemlog';

const sql =
  'SELECT systemlog.Id, systemlog.Level, systemlog.Message, systemlog.Timestamp, systemlog.Stack ' +
  'FROM systemlog ' +
  'ORDER BY systemlog.Id DESC';

router.get('', asyncMiddleware(async (req, res) => { await http.getRows(req, res, sql) }));

module.exports = router;
