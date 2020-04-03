const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const connection = require('../connection');

const router = express.Router();


router.get('/me', auth, (req, res) => {
  res.send(req.user);
});


router.post('/', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const sql = 'SELECT Id, ClientType, Username, Password, FirstName, LastName, Email, Phone FROM Client WHERE Username=?';

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
      type: row.ClientType
    }

    const token = jwt.sign(payload, config.get('jwtPrivateKey'));
    res.send(token);
  });
});


module.exports = router;
