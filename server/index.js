const express = require('express');

const auth = require('./routes/auth');
const make = require('./routes/make');
const model = require('./routes/model');
const question = require('./routes/question');
const questionattachment = require('./routes/questionattachment');
const answer = require('./routes/answer');
const usergroup = require('./routes/usergroup');
const user = require('./routes/user');
const usersession = require('./routes/usersession');
const traficom = require('./routes/traficom');
const tecdoc = require('./routes/tecdoc');
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
app.use(apiPath + 'Questions', question);
app.use(apiPath + 'QuestionAttachments', questionattachment);
app.use(apiPath + 'Answers', answer);
app.use(apiPath + 'UserGroups', usergroup);
app.use(apiPath + 'Users', user);
app.use(apiPath + 'UserSessions', usersession);

app.use(apiPath + 'traficom', traficom);
app.use(apiPath + 'tecdoc', tecdoc);
app.use(apiPath + 'data', data);

app.use(function(err, req, res, next) {
  res.status(500).send('Something failed.');
});

const connection = require('./connection');
connection.connect();

app.listen(port, () => console.log(`Listening on port ${port}...`));
