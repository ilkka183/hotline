const express = require('express');
const app = express();

const logger = require('./middleware/logger');

require('./startup/logging')();
require('./startup/config')();
require('./startup/routes')(app);

const connection = require('./localConnection');

connection.connect(err => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    process.exit(1);
  }

  const port = process.env.NODE_ENV === 'production' ? 0 : 4000;
  app.listen(port, () => logger.info(`Listening on port ${port}...`));
});
