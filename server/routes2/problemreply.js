const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const power = require('../middleware/power');

const router = express.Router();

const table = 'ProblemReply';

const sql = 
  'SELECT ProblemReply.Id, ProblemReply.Date, ProblemReply.ProblemId, ProblemReply.UserId, CONCAT(User.FirstName, " ", User.LastName) AS UserName, ' +
  'ProblemReply.Message, ProblemReply.Solution ' +
  'FROM ProblemReply, User ' +
  'WHERE ProblemReply.UserId = User.Id ' +
  'AND ProblemReply.ProblemId = ';

router.get('/problem/:ProblemId', (req, res) => { http.getRows(req, res, sql + req.params.ProblemId + ' ORDER BY ProblemReply.Id') });
router.get('/:Id', (req, res) => { http.getRow(req, res, http.sql(table, req.params.Id)) });
router.post('', [auth, power], (req, res) => { http.postRow(req, res, table) });
router.put('/:Id', [auth, power], (req, res) => { http.putRow(req, res, table, { Id: req.params.Id }) });
router.delete('/:Id', [auth, power], (req, res) => { http.deleteRow(req, res, table, { Id: req.params.Id }) });

module.exports = router;
