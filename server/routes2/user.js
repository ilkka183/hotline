const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

const table = 'User';

const sql =
  'SELECT User.Id, User.GroupId, UserGroup.Name AS GroupName, User.Email, User.Password, ' + 
  'User.Role, User.FirstName, User.LastName, User.Title, ' +
  'User.Address, User.PostalCode, User.PostOffice, User.Country, User.Phone, User.Website, ' +
  'User.Info, User.LicenseBegin, User.LicenseEnd, User.Enabled ' +
  'FROM User, UserGroup ' +
  'WHERE User.GroupId = UserGroup.Id';

router.get('', (req, res) => { http.getRows(sql + ' ORDER BY User.Id', req, res) });
router.get('/:Id', (req, res) => { http.getRow(sql + ' AND User.Id = ' + req.params.Id, req, res) });
router.post('', auth, (req, res) => { http.postRow(table, req, res) });
router.put('/:Id', auth, (req, res) => { http.putRow(table, req, res, { Id: req.params.Id }) });
router.delete('/:Id', [auth, admin], (req, res) => { http.deleteRow(table, req, res, { Id: req.params.Id }) });

module.exports = router;
