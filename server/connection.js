const mysql = require('mysql');

class Connection {
  constructor(user, password, database) {
    this.connection = mysql.createConnection({
      host: 'localhost',
      user,
      password,
      database
    });
  }

  connect(callback) {
    this.connection.connect(callback);
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

  insert(tableName, values) {
    const promise = new Promise((resolve, reject) => {
      this.connection.query('INSERT INTO ' + tableName + ' SET ?', values, (error, results, fields) => {
        if (error)
          reject(error);
    
        resolve({ results, fields });
      });
    });

    return promise;
  }
}

module.exports = Connection;
