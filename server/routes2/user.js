const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const power = require('../middleware/power');

const router = express.Router();

const table = 'User';

const fields = [
  'GroupId',
  'Role',
  'Email',
  'Password',
  'FirstName',
  'LastName',
  'Title',
  'Address',
  'PostalCode',
  'PostOffice',
  'Country', 'Phone', 'Website', 'Info', 'LicenseBegin', 'LicenseEnd', 'Enabled'];

const sql =
  'SELECT User.Id, User.GroupId, UserGroup.Name AS GroupName, User.Role, User.Email, User.Password, ' + 
  'User.FirstName, User.LastName, User.Title, ' +
  'User.Address, User.PostalCode, User.PostOffice, User.Country, User.Phone, User.Website, ' +
  'User.Info, User.LicenseBegin, User.LicenseEnd, User.Enabled ' +
  'FROM User, UserGroup ' +
  'WHERE User.GroupId = UserGroup.Id';

router.get('', (req, res) => { http.getRows(sql + ' ORDER BY User.Id', res) });
router.get('/:Id', (req, res) => { http.getRow(sql + ' AND User.Id = ' + req.params.Id, res) });
router.post('', [auth, power], (req, res) => { http.postRow(table, http.getFields(req, fields), res) });
router.put('/:Id', [auth, power], (req, res) => { http.putRow(table, http.getFields(req, fields), { Id: req.params.Id }, res) });
router.delete('/:Id', [auth, power], (req, res) => { http.deleteRow(table, { Id: req.params.Id }, res) });

module.exports = router;
