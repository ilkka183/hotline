const jwt = require('jsonwebtoken');
const config = require('./config');


module.exports = function (req, res, next) {
  if (!config.requiresAuth)
    return next();

  const token = req.header('x-auth-token');

  if (!token)
    return res.status(401).send('Access denined. No token provided.');

  try {
    const payload = jwt.verify(token, config.jwtPrivateKey);
    req.user = payload;
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token.');
  }
}
