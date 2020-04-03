module.exports = function (req, res, next) {
  if (req.user.type !== 0)
    return res.status(403).send('Access denined.');

  next();
}
