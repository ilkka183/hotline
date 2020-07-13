const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const power = require('../middleware/power');

const router = express.Router();

const table = 'Problem';

const sql = 
  'SELECT Problem.Id, Problem.Date, Problem.UserId, CONCAT(User.FirstName, " ", User.LastName) AS UserName, Problem.LicenseNumber, ' +
  'Problem.Brand, Problem.Model, Problem.ModelYear, Problem.Fuel, Problem.Title, Problem.Description, Problem.Status, ' +
  '(SELECT COUNT(*) FROM ProblemReply WHERE ProblemReply.ProblemId = Problem.Id) AS Replies ' +
  'FROM Problem, User ' +
  'WHERE Problem.UserId = User.Id ' +
  'ORDER BY Problem.Id';

const openSql = 
  'SELECT Problem.Id, Problem.Date, Problem.UserId, CONCAT(User.FirstName, " ", User.LastName) AS UserName, Problem.LicenseNumber, ' +
  'Problem.Brand, Problem.Model, Problem.ModelYear, Problem.Fuel, Problem.Title, Problem.Description, Problem.Status ' +
  'FROM Problem, User ' +
  'WHERE Problem.UserId = User.Id ' + 
  'AND Problem.Id = ';

router.get('', (req, res) => { http.getRows(req, res, sql) });
router.get('/open/:Id', (req, res) => { http.getRow(req, res, openSql + req.params.Id) });
router.get('/:Id', (req, res) => { http.getRow(req, res, http.sql(table, req.params.Id)) });
router.post('', [auth, power], (req, res) => { http.postRow(req, res, table) });
router.put('/:Id', [auth, power], (req, res) => { http.putRow(req, res, table, { Id: req.params.Id }) });
router.delete('/:Id', [auth, power], (req, res) => { http.deleteRow(req, res, table, { Id: req.params.Id }) });

module.exports = router;