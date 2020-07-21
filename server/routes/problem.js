const express = require('express');
const http = require('./methods');
const connection = require('../connection');
const auth = require('../middleware/auth');
const power = require('../middleware/power');

const router = express.Router();

const table = 'Problem';

const sql = 
  'SELECT Problem.Id, Problem.Date, Problem.UserId, CONCAT(User.FirstName, " ", User.LastName) AS UserName, Problem.RegistrationYear, Problem.RegistrationNumber, ' +
  'Problem.Make, Problem.Model, Problem.ModelYear, Problem.FuelType, Problem.EnginePower, Problem.CylinderCount, Problem.Title, Problem.Description, Problem.Solution, Problem.Status ' +
  'FROM Problem, User ' +
  'WHERE Problem.UserId = User.Id ' +
  'AND Problem.Id = ';

router.get('', (req, res) => { getProblems(req, res) });
router.get('/open/:Id', (req, res) => { http.getRow(req, res, sql + req.params.Id) });
router.get('/:Id', (req, res) => { http.getRow(req, res, http.sql(table, req.params.Id)) });
router.post('', [auth, power], (req, res) => { http.postRow(req, res, table) });
router.put('/:Id', [auth, power], (req, res) => { http.putRow(req, res, table, { Id: req.params.Id }) });
router.delete('/:Id', [auth, power], (req, res) => { http.deleteRow(req, res, table, { Id: req.params.Id }) });

function getProblems(req, res) {

  let sql = 
    'SELECT Problem.Id, Problem.Date, Problem.UserId, CONCAT(User.FirstName, " ", User.LastName) AS UserName, Problem.RegistrationYear, Problem.RegistrationNumber, ' +
    'Problem.Make, Problem.Model, Problem.ModelYear, Problem.FuelType, Problem.EnginePower, Problem.CylinderCount, ' +
    'Problem.Title, Problem.Description, Problem.Solution, Problem.Status ' +
    'FROM Problem, User ' +
    'WHERE Problem.UserId = User.Id ';

  for (const field in req.query)
    sql += 'AND ' + field + ' = ' + req.query[field] + ' ';

  sql += 'ORDER BY Problem.Id DESC';

  console.log(sql);

  connection.query(sql, (error, problems, fields) => {
    if (error) {
      console.log(error);        
      return res.status(400).send(error);
    }

    const sql = 'SELECT Id, Date, ProblemId, UserId, Message, Solution FROM ProblemReply ORDER BY ProblemId, Id';

    connection.query(sql, (error, replies, fields) => {
      if (error) {
        console.log(error);        
        return res.status(400).send(error);
      }

      for (const problem of problems)
        problem.Replies = replies.filter(reply => reply.ProblemId === problem.Id);

      res.send(problems);
    });
  });
}

module.exports = router;
