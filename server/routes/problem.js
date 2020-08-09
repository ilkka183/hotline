const express = require('express');
const http = require('./methods');
const connection = require('../connection');
const auth = require('../middleware/auth');
const power = require('../middleware/power');

const router = express.Router();

const table = 'Problem';

const sql = 
  'SELECT Problem.Id, Problem.Date, Problem.UserId, CONCAT(User.FirstName, " ", User.LastName) AS UserName, Problem.RegistrationYear, Problem.RegistrationNumber, ' +
  'Problem.Make, Problem.Model, Problem.ModelYear, Problem.FuelType, Problem.EngineCode, Problem.EnginePower, Problem.CylinderCount, ' +
  'Problem.VIN, Problem.KType, ' +
  'Problem.Title, Problem.Description, Problem.Solution, Problem.Status ' +
  'FROM Problem, User ' +
  'WHERE Problem.UserId = User.Id ' +
  'AND Problem.Id = ';

router.get('', async (req, res) => { await getProblems(req, res) });
router.get('/open/:Id', async (req, res) => { await http.getRow(req, res, sql + req.params.Id) });
router.get('/:Id', async (req, res) => { await http.getRow(req, res, http.sql(table, req.params.Id)) });
router.post('', [auth, power], async (req, res) => { await http.postRow(req, res, table) });
router.put('/:Id', [auth, power], async (req, res) => { await http.putRow(req, res, table, { Id: req.params.Id }) });
router.delete('/:Id', [auth, power], async (req, res) => { await http.deleteRow(req, res, table, { Id: req.params.Id }) });

async function getProblems(req, res) {
  let sql = 
    'SELECT Problem.Id, Problem.Date, Problem.UserId, CONCAT(User.FirstName, " ", User.LastName) AS UserName, Problem.RegistrationYear, Problem.RegistrationNumber, ' +
    'Problem.Make, Problem.Model, Problem.ModelYear, Problem.FuelType, Problem.EngineCode, Problem.EnginePower, Problem.CylinderCount, ' +
    'Problem.Title, Problem.Description, Problem.Solution, Problem.Status ' +
    'FROM Problem, User ' +
    'WHERE Problem.UserId = User.Id ';

  for (const field in req.query)
    if (field !== 'pageIndex' && field !== 'pageSize')
      sql += 'AND ' + field + ' = ' + req.query[field] + ' ';

  sql += 'ORDER BY Problem.Id DESC';

  const replySql = 'SELECT Id, Date, ProblemId, UserId, Message, Solution FROM ProblemReply ORDER BY ProblemId, Id';

  console.log(http.trim(sql));

  try {
    const { results: rows } = await connection.query(sql);
    const { results: replies } = await connection.query(replySql);

    for (const row of rows)
      row.Replies = replies.filter(reply => reply.ProblemId === row.Id);

    const response = {
      rowCount: rows.length,
      rows
    }

    res.send(response);
  }
  catch (ex) {
    console.log(error);        
    res.status(500).send(error);
  }

}

module.exports = router;
