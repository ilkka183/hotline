const mysql = require('mysql');

/*
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'suoritac_root',
  password: 'OhiOn330!',
  database: 'suoritac_hotline1'
});
*/

class Connection {
  constructor() {
    this.connection = mysql.createConnection({
      host: 'localhost',
      user: 'suoritac_root',
      password: 'OhiOn330!',
      database: 'suoritac_hotline1'
    });
  }

  connect() {
    this.connection.connect();
  }

  query(sql) {
    const promise = new Promise((resolve, reject) => {
      this.connection.query(sql, (error, results, fields) => {
        if (error)
          reject(error);
    
        resolve({ results, fields });
      });
    });

    return promise;
  }

  queryValues(sql, values) {
    const promise = new Promise((resolve, reject) => {
      this.connection.query(sql, values, (error, results, fields) => {
        if (error)
          reject(error);
    
        resolve({ results, fields });
      });
    });

    return promise;
  }
}

const connection = new Connection;

module.exports = connection;
