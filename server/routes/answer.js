const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const power = require('../middleware/power');
const asyncMiddleware = require('../middleware/async');

const router = express.Router();

const table = 'answer';

const sql = 
  'SELECT answer.Id, answer.Date, answer.QuestionId, answer.UserId, CONCAT(user.FirstName, " ", user.LastName) AS UserName, ' +
  'answer.Message, answer.File ' +
  'FROM answer, user ' +
  'WHERE answer.UserId = user.Id ' +
  'AND answer.QuestionId = ';

router.get('', asyncMiddleware(async (req, res) => { await http.getRows(req, res, sql + req.query.QuestionId + ' ORDER BY answer.Date DESC') }));
router.get('/:Id', asyncMiddleware(async (req, res) => { await http.getRow(req, res, http.sql(table, req.params.Id)) }));
router.post('', [auth], asyncMiddleware(async (req, res) => { await http.postRow(req, res, table) }));
router.put('/:Id', [auth], asyncMiddleware(async (req, res) => { await http.putRow(req, res, table, { Id: req.params.Id }) }));
router.delete('/:Id', [auth], asyncMiddleware(async (req, res) => { await http.deleteRow(req, res, table, { Id: req.params.Id }) }));

module.exports = router;
