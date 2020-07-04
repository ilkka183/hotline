const express = require('express');
const auth = require('../middleware/auth');
const { getRows, getRow, postRow, putRow, deleteRow } = require('./utils');

const router = express.Router();

const table = 'UserGroup';

const sql = 
  'SELECT Id, Name, ContactPerson,' +
  'Address, PostalCode, PostOffice, Country, Phone, Email, Website, ' +
  'Logo, Info, Enabled ' +
  'FROM UserGroup';

router.get('', (req, res) => { getRows(sql + ' ORDER BY Id', req, res) });
router.get('/:Id', (req, res) => { getRow(sql + ' WHERE Id = ' + req.params.Id, req, res) });
router.post('', auth, (req, res) => { postRow(table, req, res) });
router.put('/:Id', auth, (req, res) => { putRow(table, req, res, { Id: req.params.Id }) });
router.delete('/:Id', auth, (req, res) => { deleteRow(table, req, res, { Id: req.params.Id }) });

module.exports = router;
