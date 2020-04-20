const express = require('express');
const cors = require('cors');

const auth = require('./routes/auth');
const data = require('./routes/data');
const lookup = require('./routes/lookup');
const custom = require('./routes/custom');
const query = require('./routes/query');
const table = require('./routes/table');
const traficom = require('./routes/traficom');

const app = express();

/*
if (!process.env.hotline_jwtPrivateKey) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}
*/

const port = 3000;
//const port = 0;

app.use(express.json());
app.use(cors());
app.use('/hotline/api/auth', auth);
app.use('/hotline/api/data', data);
app.use('/hotline/api/lookup', lookup);
app.use('/hotline/api/custom', custom);
app.use('/hotline/api/query', query);
app.use('/hotline/api/table', table);
app.use('/hotline/api/traficom', traficom);

const connection = require('./connection');
connection.connect();

app.listen(port, () => console.log(`Listening on port ${port}...`));
