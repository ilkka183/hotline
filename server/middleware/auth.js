const config = require('config');
const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
  if (!config.get('requiresAuth'))
    return next();

  const token = req.header('x-auth-token');

  if (!token)
    return res.status(401).send('Access denined. No token provided.');

  try {
    const payload = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = payload;
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token.');
  }
}
