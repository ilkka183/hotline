const express = require('express');
const auth = require('../middleware/auth');
const { getRows, getRow, postRow, putRow, deleteRow } = require('./utils');

const router = express.Router();

const table = 'Movie';

const sql =
  'SELECT Movie.Id, Movie.Title, Movie.GenreId, Genre.Name AS GenreName, ' +
  'Movie.NumberInStock, Movie.DailyRentalRate, Movie.Liked FROM Movie, Genre ' +
  'WHERE Movie.GenreId = Genre.Id';

router.get('/Movies', (req, res) => { getRows(sql + ' ORDER BY Movie.Id', req, res) });
router.get('/Movie/:Id', (req, res) => { getRow(sql + ' AND Movie.Id = ' + req.params.Id, req, res) });
router.post('/Movie', auth, (req, res) => { postRow(table, req, res) });
router.put('/Movie/:Id', auth, (req, res) => { putRow(table, req, res, { Id: req.params.Id }) });
router.delete('/Movie/:Id', auth, (req, res) => { deleteRow(table, req, res, { Id: req.params.Id }) });

module.exports = router;
