const express = require('express');
const http = require('./methods');
const connection = require('../localConnection');
const auth = require('../middleware/auth');
const power = require('../middleware/power');
const asyncMiddleware = require('../middleware/async');

const router = express.Router();

const table = 'question';

const sql = 
  'SELECT question.Id, question.Date, question.UserId, CONCAT(user.FirstName, " ", user.LastName) AS UserName, question.RegistrationYear, question.RegistrationNumber, ' +
  'question.Make, question.Model, question.ModelYear, question.FuelType, question.EngineCode, question.EnginePower, question.CylinderCount, ' +
  'question.VIN, question.MID, question.TypeNumber, question.Info, ' +
  'question.Title, question.Description, question.DescriptionFile, question.Solution, question.SolutionFile, question.SolutionDate, question.Status ' +
  'FROM question, user ' +
  'WHERE question.UserId = user.Id ' +
  'AND question.Id = ';

router.get('', asyncMiddleware(async (req, res) => { await getQuestions(req, res) }));
router.get('/open/:Id', asyncMiddleware(async (req, res) => { await http.getRow(req, res, sql + req.params.Id) }));
router.get('/:Id', asyncMiddleware(async (req, res) => { await http.getRow(req, res, http.sql(table, req.params.Id)) }));
router.post('', [auth], asyncMiddleware(async (req, res) => { await http.postRow(req, res, table) }));
router.put('/:Id', [auth], asyncMiddleware(async (req, res) => { await http.putRow(req, res, table, { Id: req.params.Id }) }));
router.delete('/:Id', [auth, power], asyncMiddleware(async (req, res) => { await http.deleteRow(req, res, table, { Id: req.params.Id }) }));

function getFilter(req, counter) {
  let sql = '';

  for (const field in req.query) {
    if (field === 'pageIndex' || field === 'pageSize')
      continue;

    if (counter === 0)
      sql += ' WHERE ';
    else
      sql += ' AND ';

    if (field === 'Status' || field === 'UserId')
      sql += field + ' = ' + req.query[field] + ' ';
    else
      sql += field + ' LIKE "%' + req.query[field] + '%" ';

    counter++;
  }

  return sql;
}

async function getQuestions(req, res) {
  let countSql = 'SELECT COUNT(*) AS Count FROM question';
  countSql += getFilter(req, 0);

  console.log(countSql);

  let sql = 
    'SELECT question.Id, question.Date, question.UserId, CONCAT(user.FirstName, " ", user.LastName) AS UserName, question.RegistrationYear, question.RegistrationNumber, ' +
    'question.Make, question.Model, question.ModelYear, question.FuelType, question.EngineCode, question.EnginePower, question.CylinderCount, ' +
    'question.Title, question.Description, question.Solution, question.Status, question.Converted ' +
    'FROM question, user ' +
    'WHERE question.UserId = user.Id ';

  sql += getFilter(req, 1);
  sql += 'ORDER BY question.Date DESC';

  const pageIndex = req.query.pageIndex;
  const pageSize = req.query.pageSize;

  if (pageSize) {
    sql += ' LIMIT ';

    if (pageIndex) {
      const offset = pageIndex*pageSize;
      sql += offset + ', ';
    }

    sql += pageSize;
  }

  const answerSql = 'SELECT Id, Date, QuestionId, UserId, Message FROM answer ORDER BY QuestionId, Id';

  console.log(http.trim(sql));

  const { results: count } = await connection.query(countSql);
  const { results: rows } = await connection.query(sql);
  const { results: answers } = await connection.query(answerSql);

  for (const row of rows)
    row.Answers = answers.filter(answer => answer.QuestionId === row.Id).reverse();

  const response = {
    rowCount: count[0].Count,
    rows
  }

  res.send(response);
}

module.exports = router;
