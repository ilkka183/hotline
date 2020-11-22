const config = require('config');

function check(role) {
  return (req, res, next) => {
    if (!config.get('requiresAuth'))
      return next();

    if (req.user.role > role)
      return res.status(403).send('Access denined.');

    next();
  }
}

module.exports = {
  admin: check(0),
  power: check(1),
  user: check(2),
  demo: check(3)
}