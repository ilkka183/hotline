const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  console.log(token);

  if (!token)
    return res.status(401).send('Access denined. No token provided.');

  try {
    const payload = jwt.verify(token, process.env.hotline_jwtPrivateKey);
    req.user = payload;
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token.');
  }
}
