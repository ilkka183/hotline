const express = require('express');
const http = require('./methods');
const connection = require('../connection');
const auth = require('../middleware/auth');
const power = require('../middleware/power');

const router = express.Router();

const table = 'Question';

const sql = 
  'SELECT Question.Id, Question.Date, Question.UserId, CONCAT(User.FirstName, " ", User.LastName) AS UserName, Question.RegistrationYear, Question.RegistrationNumber, ' +
  'Question.Make, Question.Model, Question.ModelYear, Question.FuelType, Question.EngineCode, Question.EnginePower, Question.CylinderCount, ' +
  'Question.VIN, Question.TypeNumber, ' +
  'Question.Title, Question.Description, Question.Solution, Question.Status ' +
  'FROM Question, User ' +
  'WHERE Question.UserId = User.Id ' +
  'AND Question.Id = ';

router.get('', async (req, res) => { await getQuestions(req, res) });
router.get('/open/:Id', async (req, res) => { await http.getRow(req, res, sql + req.params.Id) });
router.get('/:Id', async (req, res) => { await http.getRow(req, res, http.sql(table, req.params.Id)) });
router.post('', [auth], async (req, res) => { await http.postRow(req, res, table) });
router.put('/:Id', [auth], async (req, res) => { await http.putRow(req, res, table, { Id: req.params.Id }) });
router.delete('/:Id', [auth, power], async (req, res) => { await http.deleteRow(req, res, table, { Id: req.params.Id }) });

async function getQuestions(req, res) {
  let sql = 
    'SELECT Question.Id, Question.Date, Question.UserId, CONCAT(User.FirstName, " ", User.LastName) AS UserName, Question.RegistrationYear, Question.RegistrationNumber, ' +
    'Question.Make, Question.Model, Question.ModelYear, Question.FuelType, Question.EngineCode, Question.EnginePower, Question.CylinderCount, ' +
    'Question.Title, Question.Description, Question.Solution, Question.Status ' +
    'FROM Question, User ' +
    'WHERE Question.UserId = User.Id ';

  for (const field in req.query)
    if (field !== 'pageIndex' && field !== 'pageSize')
      sql += 'AND ' + field + ' = ' + req.query[field] + ' ';

  sql += 'ORDER BY Question.Date DESC';

  const answerSql = 'SELECT Id, Date, QuestionId, UserId, Message, Solution FROM Answer ORDER BY QuestionId, Id';

  console.log(http.trim(sql));

  try {
    const { results: rows } = await connection.query(sql);
    const { results: replies } = await connection.query(answerSql);

    for (const row of rows)
      row.Replies = replies.filter(answer => answer.QuestionId === row.Id);

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
