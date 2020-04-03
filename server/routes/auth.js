const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');

const router = express.Router();


router.get('/me', auth, (req, res) => {
  res.send(req.user);
});


router.post('/', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username !== 'albert')
    return res.status(401).send('Invalid username or password');
  
  if (password !== 'ilkka')
    return res.status(401).send('Invalid username or password');

  const payload = {
    id: 1,
    firstName: 'Ilkka',
    lastName: 'Salmenius',
    email: 'ilkka.salmenius@gmail.com',
    phone: '050 61698',
    type: 0
  }  

  const token = jwt.sign(payload, config.get('jwtPrivateKey'));
  
  res.send(token);
});


module.exports = router;
