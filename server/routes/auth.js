const express = require('express');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const connection = require('../connection');

const router = express.Router();


router.get('/me', auth, (req, res) => {
  res.send(req.user);
});


router.post('/', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const sql = 'SELECT Id, Username, Password, Role, FirstName, LastName, Email, Phone FROM User WHERE Username=?';

  connection.query(sql, [username], (error, results, fields) => {
    if (error)
      return res.status(400).send(error);

    if ((results.length == 0) || (password !== results[0].Password))
      return res.status(401).send('Invalid username or password');

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

    const token = jwt.sign(payload, 'ohion330' /*process.env.hotline_jwtPrivateKey*/);
    res.send(token);
  });
});


module.exports = router;
