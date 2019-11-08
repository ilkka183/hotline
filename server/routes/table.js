const express = require('express');
const connection = require('../connection');

const router = express.Router();

router.get('/:table/row', (req, res) => {
  let sql = 'SELECT * FROM ' + req.params.table;
  const inserts = [];

  for (let key of Object.keys(req.query)) {
    if (inserts.length == 0)
      sql += ' WHERE ';
    else
      sql += ' AND ';

    sql += key + '=?';
    inserts.push(req.query[key]);
  }

  console.log(sql);
  console.log(inserts);

  connection.query(sql, inserts, (error, results, fields) => {
    if (error)
      return res.status(400).send(error);

    res.send(results);
  });
});

router.get('/:table/rows', (req, res) => {
  let sql = 'SELECT COUNT(*) as RowCount FROM ' + req.params.table;

  connection.query(sql, (error, results, fields) => {
    if (error)
      return res.status(400).send(error);

    const rowCount = results[0].RowCount;

    let sql = 'SELECT * FROM ' + req.params.table;

    if (req.query.orderBy) {
      sql += ' ORDER BY ' + req.query.orderBy;
  
      if (req.query.sortOrder)
        sql += ' ' + req.query.sortOrder;
    }
  
    let limit = 10;

    if (req.query.limit)
      limit = req.query.limit;

    sql += ' LIMIT ' + limit;

    if (req.query.offset)
      sql += ' OFFSET ' + req.query.offset;

    console.log(sql);
  
    connection.query(sql, (error, results, fields) => {
      if (error)
        return res.status(400).send(error);
  
      res.send({ rowCount, rows: results });
    });
  });
});

router.post('/:table/', async (req, res) => {
  let sql = 'INSERT INTO ' + req.params.table + ' (';

  const columns = [];
  const values = [];

  let index = 0;

  for (let column in req.body) {
    columns.push(column);
    values.push(req.body[column]);

    if (index > 0)
      sql += ', ';

    sql += '??';
    index++;
  }

  sql += ') VALUES (';
  index = 0;

  for (let column in req.body) {
    if (index > 0)
      sql += ', ';

    sql += '?';
    index++;
  }

  sql += ')';

  const inserts = [...columns, ...values];

  console.log(sql);
  console.log(inserts);

  connection.query(sql, inserts, (error, results, fields) => {
    if (error) {
      return res.status(400).send(error);
    }

    console.log(results);
    res.status(201);
    res.send(results);
  });
});

router.put('/:table/', async (req, res) => {
  let sql = 'UPDATE ' + req.params.table + ' SET ';

  const inserts = [];
  let index = 0;

  for (let name in req.body) {
    inserts.push(name);
    inserts.push(req.body[name]);

    if (index > 0)
      sql += ', ';

    sql += '?? = ?';
    index++;
  }

  sql += formatWhere(req.query, inserts);

  console.log(sql);
  console.log(inserts);

  connection.query(sql, inserts, (error, results, fields) => {
    if (error)
      return res.status(400).send(error);

    console.log(results);
    res.send(results);
  });
});

router.delete('/:table/', async (req, res) => {
  let sql = 'DELETE FROM ' + req.params.table;

  const inserts = [];
  sql += formatWhere(req.query, inserts);

  console.log(sql);
  console.log(inserts);

  connection.query(sql, inserts, (error, results, fields) => {
    if (error)
      return res.status(400).send(error);

    res.send(results);
  });
});

function formatWhere(query, inserts) {
  let sql = ' WHERE ';
  let index = 0;

  for (let name in query) {
    inserts.push(name);
    inserts.push(query[name]);

    if (index > 0)
      sql += ' AND ';

    sql += '??=?';
    index++;
  }

  return sql;
}

module.exports = router;
