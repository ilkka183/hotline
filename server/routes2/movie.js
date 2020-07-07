const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const power = require('../middleware/power');

const router = express.Router();

const table = 'Movie';
const fields = ['Title', 'GenreId', 'NumberInStock', 'DailyRentalRate'];

const sql =
  'SELECT Movie.Id, Movie.Title, Movie.GenreId, Genre.Name AS GenreName, ' +
  'Movie.NumberInStock, Movie.DailyRentalRate, Movie.Liked FROM Movie, Genre ' +
  'WHERE Movie.GenreId = Genre.Id';

router.get('', (req, res) => { http.getRows(sql + ' ORDER BY Movie.Id', res) });
router.get('/:Id', (req, res) => { http.getRow(sql + ' AND Movie.Id = ' + req.params.Id, res) });
router.post('', auth, (req, res) => { http.postRow(table, http.getFields(req, fields), res) });
router.put('/:Id', auth, (req, res) => { http.putRow(table, http.getFields(req, fields), { Id: req.params.Id }, res) });
router.delete('/:Id', [auth, power], (req, res) => { http.deleteRow(table, { Id: req.params.Id }, res) });

module.exports = router;
