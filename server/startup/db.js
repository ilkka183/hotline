const connection = require('../connection');

module.exports = function(app) {
  connection.connect();
}
