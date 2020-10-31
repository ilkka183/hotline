module.exports = function(app) {
  if (!process.env.hotline_jwtPrivateKey) {
    throw new Error('FATAL ERROR: hotline_jwtPrivateKey environment variable is not defined.');
  }
  
  if (!process.env.hotline_databasePassword) {
    throw new Error('FATAL ERROR: hotline_databasePassword environment variable is not defined.');
  }
}
