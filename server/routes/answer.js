const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const power = require('../middleware/power');

const router = express.Router();

const table = 'Answer';

const sql = 
  'SELECT Answer.Id, Answer.Date, Answer.QuestionId, Answer.UserId, CONCAT(User.FirstName, " ", User.LastName) AS UserName, ' +
  'Answer.Message, Answer.Solution ' +
  'FROM Answer, User ' +
  'WHERE Answer.UserId = User.Id ' +
  'AND Answer.QuestionId = ';

router.get('', async (req, res) => { await http.getRows(req, res, sql + req.query.QuestionId + ' ORDER BY Answer.Id') });
router.get('/:Id', async (req, res) => { await http.getRow(req, res, http.sql(table, req.params.Id)) });
router.post('', [auth], async (req, res) => { await http.postRow(req, res, table) });
router.put('/:Id', [auth], async (req, res) => { await http.putRow(req, res, table, { Id: req.params.Id }) });
router.delete('/:Id', [auth], async (req, res) => { await http.deleteRow(req, res, table, { Id: req.params.Id }) });

module.exports = router;
