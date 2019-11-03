const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ohion330!',
  database: 'hotline_1_0'
});

module.exports = connection;
