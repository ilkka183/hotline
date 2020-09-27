const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const power = require('../middleware/power');
const user = require('../middleware/user');

const router = express.Router();

const table = 'User';

const sql =
  'SELECT User.Id, User.GroupId, UserGroup.Name AS GroupName, User.Role, User.Email, User.Password, ' + 
  'User.FirstName, User.LastName, CONCAT(User.FirstName, " ", User.LastName) AS Name, User.Title, ' +
  'User.Address, User.PostalCode, User.PostOffice, User.Country, User.Phone, User.Url, ' +
  'User.Info, User.LicenseBegin, User.LicenseEnd, User.Enabled ' +
  'FROM User, UserGroup ' +
  'WHERE User.GroupId = UserGroup.Id';

router.get('', async (req, res) => { await http.getRows(req, res, sql) });
router.get('/:Id', async (req, res) => { await http.getRow(req, res, http.sql(table, req.params.Id)) });
router.post('', [auth, power], async (req, res) => { await http.postRow(req, res, table) });
router.put('/:Id', [auth, user], async (req, res) => { await http.putRow(req, res, table, { Id: req.params.Id }) });
router.delete('/:Id', [auth, power], async (req, res) => { await http.deleteRow(req, res, table, { Id: req.params.Id }) });

module.exports = router;
