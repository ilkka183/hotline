const express = require('express');
const auth = require('../middleware/auth');
const { getRows, getRow, postRow, putRow, deleteRow } = require('./utils');

const router = express.Router();

const table = 'User';

const sql =
  'SELECT User.Id, User.GroupId, UserGroup.Name AS GroupName, User.Email, User.Password, ' + 
  'User.Role, User.FirstName, User.LastName, User.Title, ' +
  'User.Address, User.PostalCode, User.PostOffice, User.Country, User.Phone, User.Website, ' +
  'User.Info, User.LicenseBegin, User.LicenseEnd, User.Enabled ' +
  'FROM User, UserGroup ' +
  'WHERE User.GroupId = UserGroup.Id'

router.get('/Users', (req, res) => { getRows(sql + ' ORDER BY User.Id', req, res) });
router.get('/User/:Id', (req, res) => { getRow(sql + ' AND User.Id = ' + req.params.Id, req, res) });
router.post('/User', auth, (req, res) => { postRow(table, req, res) });
router.put('/User/:Id', auth, (req, res) => { putRow(table, req, res, { Id: req.params.Id }) });
router.delete('/User/:Id', auth, (req, res) => { deleteRow(table, req, res, { Id: req.params.Id }) });

module.exports = router;
