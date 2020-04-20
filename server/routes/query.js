const express = require('express');
const connection = require('../connection');

const router = express.Router();


router.get('/rows', (req, res) => {
  let sql = 'SELECT COUNT(*) as RowCount FROM ' + req.query.table;
  console.log(sql);

  connection.query(sql, (error, results, fields) => {
    if (error)
      return res.status(400).send(error);

    const rowCount = results[0].RowCount;

    let sql = req.query.sql;
    let limit = 10;

    if (req.query.limit)
      limit = req.query.limit;

    sql += ' LIMIT ' + limit;

    if (req.query.offset)
      sql += ' OFFSET ' + req.query.offset;

    console.log(sql);
  
    connection.query(sql, (error, results, fields) => {
      if (error) {
        console.log(error);        
        return res.status(400).send(error);
      }
  
      res.send({ rowCount, rows: results });
    });
  });
});

module.exports = router;
