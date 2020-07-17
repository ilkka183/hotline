const express = require('express');

const lookup = require('./routes/lookup');
const custom = require('./routes/custom');
const query = require('./routes/query');
const table = require('./routes/table');

const auth = require('./routes/auth');
const traficom = require('./routes/traficom');
const data = require('./routes/data');

const make = require('./routes2/make');
const problem = require('./routes2/problem');
const problemattachment = require('./routes2/problemattachment');
const problemreply = require('./routes2/problemreply');
const usergroup = require('./routes2/usergroup');
const user = require('./routes2/user');

const app = express();

/*
if (!process.env.hotline_jwtPrivateKey) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}
*/

const localhost = false;
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

app.use(apiPath + 'lookup', lookup);
app.use(apiPath + 'custom', custom);
app.use(apiPath + 'query', query);
app.use(apiPath + 'table', table);

app.use(apiPath + 'auth', auth);
app.use(apiPath + 'traficom', traficom);
app.use(apiPath + 'data', data);

app.use(apiPath + 'Makes', make);
app.use(apiPath + 'Problems', problem);
app.use(apiPath + 'ProblemAttachments', problemattachment);
app.use(apiPath + 'ProblemReplies', problemreply);
app.use(apiPath + 'UserGroups', usergroup);
app.use(apiPath + 'Users', user);

const connection = require('./connection');
connection.connect();

app.listen(port, () => console.log(`Listening on port ${port}...`));
