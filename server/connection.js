const mysql = require('mysql');
const config = require('config');

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
