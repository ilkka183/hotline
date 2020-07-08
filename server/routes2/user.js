const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const power = require('../middleware/power');

const router = express.Router();

const table = 'User';

const sql =
  'SELECT User.Id, User.GroupId, UserGroup.Name AS GroupName, User.Role, User.Email, User.Password, ' + 
  'User.FirstName, User.LastName, User.Title, ' +
  'User.Address, User.PostalCode, User.PostOffice, User.Country, User.Phone, User.Website, ' +
  'User.Info, User.LicenseBegin, User.LicenseEnd, User.Enabled ' +
  'FROM User, UserGroup ' +
  'WHERE User.GroupId = UserGroup.Id ' +
  'ORDER BY User.Id';

router.get('', (req, res) => { http.getRows(req, res, sql) });
router.get('/:Id', (req, res) => { http.getRow(req, res, 'SELECT * FROM User WHERE Id = ' + req.params.Id) });
router.post('', [auth, power], (req, res) => { http.postRow(req, res, table) });
router.put('/:Id', [auth, power], (req, res) => { http.putRow(req, res, table, { Id: req.params.Id }) });
router.delete('/:Id', [auth, power], (req, res) => { http.deleteRow(req, res, table, { Id: req.params.Id }) });

module.exports = router;
