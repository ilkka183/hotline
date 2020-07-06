const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

const table = 'Genre';

const sql = 'SELECT Id, Name FROM Genre';

router.get('', (req, res) => { http.getRows(sql + ' ORDER BY Id', req, res) });
router.get('/:Id', (req, res) => { http.getRow(sql + ' WHERE Id = ' + req.params.Id, req, res) });
router.post('', auth, (req, res) => { http.postRow(table, req, res) });
router.put('/:Id', auth, (req, res) => { http.putRow(table, req, res, { Id: req.params.Id }) });
router.delete('/:Id', [auth, admin], (req, res) => { http.deleteRow(table, req, res, { Id: req.params.Id }) });

module.exports = router;
