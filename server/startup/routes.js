const express = require('express');
const lookup = require('../routes/lookup');
const table = require('../routes/table');

module.exports = function (app) {
  app.use(express.json());

  app.use('/api/lookup', lookup);
  app.use('/api/table', table);
}
