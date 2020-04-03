const express = require('express');
const connection = require('../connection');

const router = express.Router();


router.get('/text', (req, res) => {
  const sql = req.query.sql;
  const inserts = [req.query.id];

  console.log(sql);
  console.log(inserts);

  connection.query(sql, inserts, (error, results, fields) => {
    if (error)
      return res.status(400).send(error);

      console.log(results);
      res.send(results);
  });
});


router.get('/list', (req, res) => {
  const sql = req.query.sql;

  console.log(sql);

  connection.query(sql, (error, results, fields) => {
    if (error)
      return res.status(400).send(error);

      console.log(results);
      res.send(results);
  });
});


module.exports = router;
