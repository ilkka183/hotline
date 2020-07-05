const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../middleware/config');
const auth = require('../middleware/auth');
const connection = require('../connection');

const router = express.Router();


function generateToken(payload) {
  console.log(payload);
  return jwt.sign(payload, config.jwtPrivateKey);
}


router.get('/me', auth, (req, res) => {
  res.send(req.user);
});


router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const sql = 'SELECT Id, Email, Password, Role, FirstName, LastName, Phone FROM User WHERE Email=?';

  connection.query(sql, [email], (error, results, fields) => {
    if (error)
      return res.status(400).send(error);

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
  });
});


router.post('/register', (req, res) => {
  let sql = 'INSERT INTO User (GroupId, Role, FirstName, LastName, Email, Password, Enabled) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [];

  for (const column in req.body) 
    values.push(req.body[column]);

  connection.query(sql, values, (error, results, fields) => {
    if (error)
      return res.status(400).send(error);

    const payload = {
      id: results.insertId,
      ...req.body
    }

    const token = generateToken(payload);

    res
      .header('x-auth-token', token)
      .header('access-control-expose-headers', 'x-auth-token')
      .send(token);
  });
});


module.exports = router;
