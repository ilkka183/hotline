const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const power = require('../middleware/power');

const router = express.Router();

const table = 'UserGroup';

const sql = 
  'SELECT Id, Name, ContactPerson,' +
  'Address, PostalCode, PostOffice, Country, Phone, Email, Website, ' +
  'Logo, Info, Enabled ' +
  'FROM UserGroup';

router.get('', (req, res) => { http.getRows(sql + ' ORDER BY Id', res) });
router.get('/:Id', (req, res) => { http.getRow(sql + ' WHERE Id = ' + req.params.Id, res) });
router.post('', [auth, power], (req, res) => { http.postRow(table, req, res) });
router.put('/:Id', [auth, power], (req, res) => { http.putRow(table, req, res, { Id: req.params.Id }) });
router.delete('/:Id', [auth, power], (req, res) => { http.deleteRow(table, res, { Id: req.params.Id }) });

module.exports = router;
