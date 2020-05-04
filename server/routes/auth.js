const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../middleware/config');
const auth = require('../middleware/auth');
const connection = require('../connection');

const router = express.Router();


router.get('/me', auth, (req, res) => {
  res.send(req.user);
});


router.post('/', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const sql = 'SELECT Id, Email, Password, Role, FirstName, LastName, Phone FROM User WHERE Email=?';

  connection.query(sql, [email], (error, results, fields) => {
    if (error)
      return res.status(400).send(error);

    if ((results.length == 0) || (password !== results[0].Password))
      return res.status(401).send('Invalid email or password');

    const row = results[0];
  
    const payload = {
      id: row.Id,
      firstName: row.FirstName,
      lastName: row.LastName,
      email: row.Email,
      phone: row.Phone,
      role: row.Role
    }

    console.log(payload);

    const token = jwt.sign(payload, config.jwtPrivateKey);
    res.send(token);
  });
});


module.exports = router;
