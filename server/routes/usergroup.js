const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const power = require('../middleware/power');

const router = express.Router();

const table = 'usergroup';

const sql = 
  'SELECT Id, Tunnus, Name, ContactPerson,' +
  'Address, PostalCode, PostOffice, Country, Phone, Email, Url, ' +
  'Logo, Info, Class, LicenseBegin, LicenseEnd, Enabled ' +
  'FROM usergroup';

router.get('', async (req, res) => { await http.getRows(req, res, sql) });
router.get('/:Id', async (req, res) => { await http.getRow(req, res, http.sql(table, req.params.Id)) });
router.post('', [auth, power], async (req, res) => { await http.postRow(req, res, table) });
router.put('/:Id', [auth, power], async (req, res) => { await http.putRow(req, res, table, { Id: req.params.Id }) });
router.delete('/:Id', [auth, power], async (req, res) => { await http.deleteRow(req, res, table, { Id: req.params.Id }) });

module.exports = router;
