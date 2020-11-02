const config = require('config');
const Connection = require('./connection');

class LocalConnection extends Connection {
  constructor() {
    super(
      config.get('db.user'),
      config.get('db.password'),
      config.get('db.database'));
  }
}

const connection = new LocalConnection;

module.exports = connection;
