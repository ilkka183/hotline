const express = require('express');
const http = require('./methods');

const router = express.Router();

const table = 'usersession';

const sql =
  'SELECT usersession.Id, usersession.UserId, user.FirstName, user.LastName, ' +
  'usersession.LoginTime, usersession.LogoutTime, usersession.IPAddress ' + 
  'FROM usersession, user ' +
  'WHERE usersession.UserId = user.Id ' +
  'ORDER BY usersession.Id DESC';

router.get('', async (req, res) => { await http.getRows(req, res, sql) });

module.exports = router;
