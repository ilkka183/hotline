const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'suoritac_root',
  password: 'OhiOn330!',
  database: 'suoritac_hotline1'
});

module.exports = connection;
