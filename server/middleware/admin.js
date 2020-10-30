const config = require('config');

module.exports = function (req, res, next) {
  if (!config.get('requiresAuth'))
    return next();

  if (req.user.role > 0)
    return res.status(403).send('Access denined.');

  next();
}
