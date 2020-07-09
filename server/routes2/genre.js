const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const power = require('../middleware/power');

const router = express.Router();

const table = 'Genre';

const sql = 'SELECT Id, Name FROM Genre ORDER BY Id';

router.get('', (req, res) => { http.getRows(req, res, sql) });
router.get('/:Id', (req, res) => { http.getRow(req, res, http.sql(table, req.params.Id)) });
router.post('', auth, (req, res) => { http.postRow(req, res, table) });
router.put('/:Id', auth, (req, res) => { http.putRow(req, res, table, { Id: req.params.Id }) });
router.delete('/:Id', [auth, power], (req, res) => { http.deleteRow(req, res, table, { Id: req.params.Id }) });

module.exports = router;
