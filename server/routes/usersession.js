const express = require('express');
const http = require('./methods');
const asyncMiddleware = require('../middleware/async');

const router = express.Router();

const table = 'usersession';

const sql =
  'SELECT usersession.Id, usersession.UserId, user.FirstName, user.LastName, user.Role, usergroup.Name AS GroupName, ' +
  'usersession.LoginTime, usersession.LogoutTime, usersession.IPAddress ' + 
  'FROM usersession, usergroup, user ' +
  'WHERE usersession.UserId = user.Id ' +
  'AND usergroup.Id = user.GroupId ' +
  'ORDER BY usersession.Id DESC';

router.get('', asyncMiddleware(async (req, res) => { await http.getRows(req, res, sql) }));

module.exports = router;
