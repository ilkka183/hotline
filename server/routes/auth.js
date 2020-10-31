const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const connection = require('../connection');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');

const router = express.Router();


function generateToken(payload) {
  return jwt.sign(payload, config.get('jwtPrivateKey'));
}


router.get('/test', (req, res) => {
  res.send('OK');
});


router.get('/me', auth, (req, res) => {
  res.send(req.user);
});


router.post('/login', asyncMiddleware(async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const sql = 'SELECT Id, Username, Password, Role, FirstName, LastName, Email, Phone FROM user WHERE Username=?';

  const { results } = await connection.queryValues(sql, [username]);

  if ((results.length == 0) || (password !== results[0].Password))
    return res.status(401).send('Invalid username or password.');

  const row = results[0];

  const payload = {
    id: row.Id,
    username: row.Username,
    firstName: row.FirstName,
    lastName: row.LastName,
    email: row.Email,
    phone: row.Phone,
    role: row.Role
  }

  const token = generateToken(payload);

  const updateSql = 'UPDATE user SET LastLogin=NOW() WHERE Username=?';
  await connection.queryValues(updateSql, [username]);

  const insertSql = 'INSERT INTO usersession (UserId) VALUES(?)';
  await connection.queryValues(insertSql, [row.Id]);

  res.send(token);
}));


router.post('/logout', asyncMiddleware(async (req, res) => {
  const userId = req.body.userId;
  
  const sql = 'SELECT Id, Username, Password, Role, FirstName, LastName, Phone FROM user WHERE Id=?';

  await connection.queryValues(sql, [userId]);

  let updateSql = 'UPDATE user SET LastLogout=NOW() WHERE Id=?';
  await connection.queryValues(updateSql, [userId]);

  updateSql = 'UPDATE usersession SET LogoutTime=NOW() WHERE UserId=? ORDER BY Id DESC LIMIT 1';
  await connection.queryValues(updateSql, [userId]);

  res.send('OK');
}));


router.post('/register', asyncMiddleware(async (req, res) => {
  res.status(403).send('Not in use');
  return;

  let sql = 'INSERT INTO User (GroupId, Role, FirstName, LastName, Username, Password, Email, Enabled) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [];

  for (const column in req.body) 
    values.push(req.body[column]);

  const { results } = await connection.queryValues(sql, values);

  const payload = {
    id: results.insertId,
    ...req.body
  }

  const token = generateToken(payload);

  res.header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .send(token);
}));


router.post('/changepassword', asyncMiddleware(async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const newPassword = req.body.newPassword;

  const sql = 'SELECT Id, Username, Password, Role, FirstName, LastName, Phone FROM user WHERE Username=?';

  const { results } = await connection.queryValues(sql, [username]);

  if ((results.length == 0) || (password !== results[0].Password))
    return res.status(401).send('Invalid password.');

  const updateSql = 'UPDATE user SET Password=? WHERE Username=?';
  await connection.queryValues(updateSql, [newPassword, username]);

  res.send('OK');
}));


module.exports = router;
