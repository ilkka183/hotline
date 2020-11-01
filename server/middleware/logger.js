const { createLogger, format, transports } = require('winston');
const Transport = require('winston-transport');

const connection = require('../connection');


class DatabaseTransport extends Transport {
  constructor(opts) {
    super(opts);
  }

  async insert(info) {
    let sql = 'INSERT INTO systemlog (Level, Message, Timestamp, Stack) VALUES (?, ?, ?, ?)';

    const values = [
      info.level,
      info.message,
      new Date(info.timestamp),
      info.stack
    ];
  
    await connection.queryValues(sql, values);
  }
 
  async log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });
 
    await this.insert(info);

    callback();
  }
};


const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.prettyPrint()
  ),  
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log' }),
    new DatabaseTransport()
  ]
});


module.exports = logger;
