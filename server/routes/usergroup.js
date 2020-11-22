const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const user = require('../middleware/user');
const asyncMiddleware = require('../middleware/async');

const router = express.Router();

const table = 'usergroup';

const sql = 
  'SELECT Id, Tunnus, Name, BusinessId, ContactPerson,' +
  'Address, PostalCode, PostOffice, Country, Phone, Email, Url, Info, ' +
  'Logo, LogoText, LogoFile, LicenseBegin, LicenseEnd, Class, Enabled, Converted, InsertedAt, UpdatedAt ' +
  'FROM usergroup';

router.get('', asyncMiddleware(async (req, res) => { await http.getRows(req, res, sql) }));
router.get('/:Id', asyncMiddleware(async (req, res) => { await http.getRow(req, res, http.sql(table, req.params.Id)) }));
router.post('', [auth, user.power], asyncMiddleware(async (req, res) => { await http.postRow(req, res, table) }));
router.put('/:Id', [auth, user.power], asyncMiddleware(async (req, res) => { await http.putRow(req, res, table, { Id: req.params.Id }) }));
router.delete('/:Id', [auth, user.power], asyncMiddleware(async (req, res) => { await http.deleteRow(req, res, table, { Id: req.params.Id }) }));

module.exports = router;
