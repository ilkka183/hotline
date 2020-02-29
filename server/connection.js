const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ohion330!',
  database: 'hotline1'
});

module.exports = connection;
