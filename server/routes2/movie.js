const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const power = require('../middleware/power');

const router = express.Router();

const table = 'Movie';

const sql =
  'SELECT Movie.Id, Movie.Title, Movie.GenreId, Genre.Name AS GenreName, ' +
  'Movie.NumberInStock, Movie.DailyRentalRate, Movie.Enabled FROM Movie, Genre ' +
  'WHERE Movie.GenreId = Genre.Id ' +
  'ORDER BY Movie.Id';

router.get('', (req, res) => { http.getRows(req, res, sql) });
router.get('/:Id', (req, res) => { http.getRow(req, res, 'SELECT * FROM Movie WHERE Id = ' + req.params.Id) });
router.post('', auth, (req, res) => { http.postRow(req, res, table) });
router.put('/:Id', auth, (req, res) => { http.putRow(req, res, table, { Id: req.params.Id }) });
router.delete('/:Id', [auth, power], (req, res) => { http.deleteRow(req, res, table, { Id: req.params.Id }) });

module.exports = router;
