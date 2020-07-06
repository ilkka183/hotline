const express = require('express');
const http = require('./methods');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

const table = 'Movie';

const sql =
  'SELECT Movie.Id, Movie.Title, Movie.GenreId, Genre.Name AS GenreName, ' +
  'Movie.NumberInStock, Movie.DailyRentalRate, Movie.Liked FROM Movie, Genre ' +
  'WHERE Movie.GenreId = Genre.Id';

router.get('', (req, res) => { http.getRows(sql + ' ORDER BY Movie.Id', req, res) });
router.get('/:Id', (req, res) => { http.getRow(sql + ' AND Movie.Id = ' + req.params.Id, req, res) });
router.post('', auth, (req, res) => { http.postRow(table, req, res) });
router.put('/:Id', auth, (req, res) => { http.putRow(table, req, res, { Id: req.params.Id }) });
router.delete('/:Id', [auth, admin], (req, res) => { http.deleteRow(table, req, res, { Id: req.params.Id }) });

module.exports = router;
