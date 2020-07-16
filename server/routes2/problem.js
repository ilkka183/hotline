const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const power = require('../middleware/power');

const router = express.Router();

const table = 'Problem';

const commonSql = 
  'SELECT Problem.Id, Problem.Date, Problem.UserId, CONCAT(User.FirstName, " ", User.LastName) AS UserName, Problem.RegistrationYear, Problem.RegistrationNumber, ' +
  'Problem.Make, Problem.Model, Problem.ModelYear, Problem.FuelType, Problem.Power, Problem.CylinderCount, Problem.Title, Problem.Description, Problem.Status';

const listSql = commonSql +
  ', (SELECT COUNT(*) FROM ProblemReply WHERE ProblemReply.ProblemId = Problem.Id) AS Replies ' +
  'FROM Problem, User ' +
  'WHERE Problem.UserId = User.Id ';
  
const openSql =  commonSql +
  ' FROM Problem, User ' +
  'WHERE Problem.UserId = User.Id ' + 
  'AND Problem.Id = ';

function getListSql(req) {
  let sql = listSql;

  for (const field in req.query)
    sql += 'AND ' + field + ' = ' + req.query[field] + ' ';

  sql += 'ORDER BY Problem.Id DESC';

  return sql;
}

router.get('', (req, res) => { http.getRows(req, res, getListSql(req)) });
router.get('/open/:Id', (req, res) => { http.getRow(req, res, openSql + req.params.Id) });
router.get('/:Id', (req, res) => { http.getRow(req, res, http.sql(table, req.params.Id)) });
router.post('', [auth, power], (req, res) => { http.postRow(req, res, table) });
router.put('/:Id', [auth, power], (req, res) => { http.putRow(req, res, table, { Id: req.params.Id }) });
router.delete('/:Id', [auth, power], (req, res) => { http.deleteRow(req, res, table, { Id: req.params.Id }) });

module.exports = router;
