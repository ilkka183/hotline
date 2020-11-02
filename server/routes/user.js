const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const power = require('../middleware/power');
const user = require('../middleware/user');
const asyncMiddleware = require('../middleware/async');

const router = express.Router();

const table = 'user';

const sql =
  'SELECT user.Id, user.GroupId, usergroup.Name AS GroupName, user.Role, user.Email, user.Username, user.Password, ' + 
  'user.FirstName, user.LastName, CONCAT(user.FirstName, " ", user.LastName) AS Name, user.CompanyName, user.Title, ' +
  'user.Address, user.PostalCode, user.PostOffice, user.Country, user.Phone, user.Url, ' +
  'user.Info, user.LicenseBegin, user.LicenseEnd, user.Enabled, user.Converted ' +
  'FROM user, usergroup ' +
  'WHERE user.GroupId = usergroup.Id';

router.get('', asyncMiddleware(async (req, res) => { await http.getRows(req, res, sql) }));
router.get('/:Id', asyncMiddleware(async (req, res) => { await http.getRow(req, res, http.sql(table, req.params.Id)) }));
router.post('', [auth, power], asyncMiddleware(async (req, res) => { await http.postRow(req, res, table) }));
router.put('/:Id', [auth, user], asyncMiddleware(async (req, res) => { await http.putRow(req, res, table, { Id: req.params.Id }) }));
router.delete('/:Id', [auth, power], asyncMiddleware(async (req, res) => { await http.deleteRow(req, res, table, { Id: req.params.Id }) }));

module.exports = router;
