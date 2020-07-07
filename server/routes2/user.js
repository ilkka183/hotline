const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const power = require('../middleware/power');

const router = express.Router();

const table = 'User';

const sql =
  'SELECT User.Id, User.GroupId, UserGroup.Name AS GroupName, User.Email, User.Password, ' + 
  'User.Role, User.FirstName, User.LastName, User.Title, ' +
  'User.Address, User.PostalCode, User.PostOffice, User.Country, User.Phone, User.Website, ' +
  'User.Info, User.LicenseBegin, User.LicenseEnd, User.Enabled ' +
  'FROM User, UserGroup ' +
  'WHERE User.GroupId = UserGroup.Id';

router.get('', (req, res) => { http.getRows(sql + ' ORDER BY User.Id', res) });
router.get('/:Id', (req, res) => { http.getRow(sql + ' AND User.Id = ' + req.params.Id, res) });
router.post('', [auth, power], (req, res) => { http.postRow(table, req, res) });
router.put('/:Id', [auth, power], (req, res) => { http.putRow(table, req, res, { Id: req.params.Id }) });
router.delete('/:Id', [auth, power], (req, res) => { http.deleteRow(table, res, { Id: req.params.Id }) });

module.exports = router;
