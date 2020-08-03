const express = require('express');
const jwt = require('jsonwebtoken');
const connection = require('../connection');
const config = require('../middleware/config');
const auth = require('../middleware/auth');

const router = express.Router();


function generateToken(payload) {
  return jwt.sign(payload, config.jwtPrivateKey);
}


router.get('/me', auth, (req, res) => {
  res.send(req.user);
});


router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const sql = 'SELECT Id, Email, Password, Role, FirstName, LastName, Phone FROM User WHERE Email=?';

  try {
    const { results } = await connection.queryValues(sql, [email]);

    if ((results.length == 0) || (password !== results[0].Password))
      return res.status(401).send('Invalid email or password.');

    const row = results[0];
  
    const payload = {
      id: row.Id,
      firstName: row.FirstName,
      lastName: row.LastName,
      email: row.Email,
      phone: row.Phone,
      role: row.Role
    }

    const token = generateToken(payload);

    res.send(token);
  }
  catch (ex) {
    console.error(ex);
    res.status(500).send(ex);
  }
});


router.post('/changepassword', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const newPassword = req.body.newPassword;

  const sql = 'SELECT Id, Email, Password, Role, FirstName, LastName, Phone FROM User WHERE Email=?';

  try {
    const { results } = await connection.queryValues(sql, [email]);

    if ((results.length == 0) || (password !== results[0].Password))
      return res.status(401).send('Invalid password.');

    const updateSql = 'UPDATE User SET Password=? WHERE Email=?';
    await connection.queryValues(updateSql, [newPassword, email]);

    res.send('OK');
  }
  catch (ex) {
    console.error(ex);
    res.status(500).send(ex);
  }
});


router.post('/register', async (req, res) => {
  let sql = 'INSERT INTO User (GroupId, Role, FirstName, LastName, Email, Password, Enabled) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [];

  for (const column in req.body) 
    values.push(req.body[column]);

  try {
    const { results } = await connection.queryValues(sql, values);

    const payload = {
      id: results.insertId,
      ...req.body
    }

    const token = generateToken(payload);

    res.header('x-auth-token', token)
      .header('access-control-expose-headers', 'x-auth-token')
      .send(token);
  }
  catch (ex) {
    console.error(ex);
    res.status(500).send(ex);
  }
});


module.exports = router;
