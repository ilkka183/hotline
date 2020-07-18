const express = require('express');

const auth = require('./routes/auth');
const make = require('./routes/make');
const model = require('./routes/model');
const problem = require('./routes/problem');
const problemattachment = require('./routes/problemattachment');
const problemreply = require('./routes/problemreply');
const usergroup = require('./routes/usergroup');
const user = require('./routes/user');
const traficom = require('./routes/traficom');
const data = require('./routes/data');

const app = express();

/*
if (!process.env.hotline_jwtPrivateKey) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}
*/

const production = process.env.PORT == '0';
const port = production ? 0 : 4000;

app.use(express.json());

app.use(function(req, res, next) {
  if (!production)
    res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");

  next();
});

const apiPath = '/hotline/api/';

app.use(apiPath + 'auth', auth);

app.use(apiPath + 'Makes', make);
app.use(apiPath + 'Models', model);
app.use(apiPath + 'Problems', problem);
app.use(apiPath + 'ProblemAttachments', problemattachment);
app.use(apiPath + 'ProblemReplies', problemreply);
app.use(apiPath + 'UserGroups', usergroup);
app.use(apiPath + 'Users', user);

app.use(apiPath + 'traficom', traficom);
app.use(apiPath + 'data', data);

const connection = require('./connection');
connection.connect();

app.listen(port, () => console.log(`Listening on port ${port}...`));
