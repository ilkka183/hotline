const express = require('express');

const auth = require('./routes/auth');
const data = require('./routes/data');
const lookup = require('./routes/lookup');
const custom = require('./routes/custom');
const query = require('./routes/query');
const table = require('./routes/table');
const traficom = require('./routes/traficom');

const usergroup = require('./routes/usergroup');
const user = require('./routes/user');

const app = express();

/*
if (!process.env.hotline_jwtPrivateKey) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}
*/

const localhost = true;
const port = localhost ? 4000 : 0;

app.use(express.json());

app.use(function(req, res, next) {
  if (localhost)
    res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");

  next();
});

app.use('/hotline/api/auth', auth);
app.use('/hotline/api/data', data);
app.use('/hotline/api/lookup', lookup);
app.use('/hotline/api/custom', custom);
app.use('/hotline/api/query', query);
app.use('/hotline/api/table', table);
app.use('/hotline/api/traficom', traficom);

app.use('/hotline/api', usergroup);
app.use('/hotline/api', user);

const connection = require('./connection');
connection.connect();

app.listen(port, () => console.log(`Listening on port ${port}...`));
