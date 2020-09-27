const migrate = require('./migration/all');

const connection = require('./connection');
connection.connect();

migrate(connection);
