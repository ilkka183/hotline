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
const genre = require('./routes/genre');
const movie = require('./routes/movie');

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

const apiPath = '/hotline/api/';

app.use(apiPath + 'auth', auth);
app.use(apiPath + 'data', data);
app.use(apiPath + 'lookup', lookup);
app.use(apiPath + 'custom', custom);
app.use(apiPath + 'query', query);
app.use(apiPath + 'table', table);
app.use(apiPath + 'traficom', traficom);

app.use(apiPath + 'UserGroups', usergroup);
app.use(apiPath + 'Users', user);
app.use(apiPath + 'Genres', genre);
app.use(apiPath + 'Movies', movie);

const connection = require('./connection');
connection.connect();

app.listen(port, () => console.log(`Listening on port ${port}...`));
