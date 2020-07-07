const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const power = require('../middleware/power');

const router = express.Router();

const table = 'Genre';
const fields = ['Id', 'Name'];
const sql = 'SELECT Id, Name FROM Genre';

router.get('', (req, res) => { http.getRows(sql + ' ORDER BY Id', res) });
router.get('/:Id', (req, res) => { http.getRow(sql + ' WHERE Id = ' + req.params.Id, res) });
router.post('', auth, (req, res) => { http.postRow(table, http.getFields(req, fields), res) });
router.put('/:Id', auth, (req, res) => { http.putRow(table, http.getFields(req, fields), { Id: req.params.Id }, res) });
router.delete('/:Id', [auth, power], (req, res) => { http.deleteRow(table, { Id: req.params.Id }, res) });

module.exports = router;
