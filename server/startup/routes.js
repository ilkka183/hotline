const express = require('express');

const auth = require('../routes/auth');
const make = require('../routes/make');
const model = require('../routes/model');
const question = require('../routes/question');
const answer = require('../routes/answer');
const usergroup = require('../routes/usergroup');
const user = require('../routes/user');
const usersession = require('../routes/usersession');
const systemlog = require('../routes/systemlog');
const traficom = require('../routes/traficom');
const tecdoc = require('../routes/tecdoc');
const data = require('../routes/data');

const error = require('../middleware/error');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Accept, Content-Type, Origin, X-Auth-Token, X-Requested-With');
  
    next();
  });
  
  const apiPath = '/hotline/api/';

  app.use(express.json());
  app.use(apiPath + 'auth', auth);
  app.use(apiPath + 'usergroup', usergroup);
  app.use(apiPath + 'user', user);
  app.use(apiPath + 'make', make);
  app.use(apiPath + 'model', model);
  app.use(apiPath + 'usersession', usersession);
  app.use(apiPath + 'systemlog', systemlog);
  app.use(apiPath + 'question', question);
  app.use(apiPath + 'answer', answer);
  app.use(apiPath + 'traficom', traficom);
  app.use(apiPath + 'tecdoc', tecdoc);
  app.use(apiPath + 'data', data);
  app.use(error);
}
