const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const power = require('../middleware/power');

const router = express.Router();

const table = 'ProblemAttachment';

const sql = 
  'SELECT ProblemAttachment.Id, ProblemAttachment.ProblemId, ProblemAttachment.FileName, ProblemAttachment.FileType, ' +
  'ProblemAttachment.Content, ProblemAttachment.Description ' +
  'FROM ProblemAttachment ' +
  'WHERE ProblemAttachment.ProblemId = ';

router.get('', (req, res) => { http.getRows(req, res, sql + req.query.ProblemId + ' ORDER BY ProblemAttachment.Id') });
router.get('/:Id', (req, res) => { http.getRow(req, res, http.sql(table, req.params.Id)) });
router.post('', [auth, power], (req, res) => { http.postRow(req, res, table) });
router.put('/:Id', [auth, power], (req, res) => { http.putRow(req, res, table, { Id: req.params.Id }) });
router.delete('/:Id', [auth, power], (req, res) => { http.deleteRow(req, res, table, { Id: req.params.Id }) });

module.exports = router;
