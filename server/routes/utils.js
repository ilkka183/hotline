const connection = require('../connection');


function getRow(sql, req, res) {
  console.log(sql);

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.log(error);        
      return res.status(400).send(error);
    }

    res.send(results);
  });
}


function getRows(sql, req, res) {
  const index = sql.indexOf('FROM');

  if (index === -1)
    return res.status(400).send('No FROM keyword in the SQL query!');

  let countSql = 'SELECT COUNT(*) as RowCount ' + sql.substring(index, sql.length);
  console.log(countSql);

  connection.query(countSql, (error, results, fields) => {
    if (error)
      return res.status(400).send(error);

    const rowCount = results[0].RowCount;

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
}


function postRow(tableName, req, res) {
  let sql = 'INSERT INTO ' + tableName + ' (';

  const columns = [];
  const values = [];

  let index = 0;

  for (const column in req.body) {
    columns.push(column);
    values.push(req.body[column]);

    if (index > 0)
      sql += ', ';

    sql += '??';
    index++;
  }

  sql += ') VALUES (';
  index = 0;

  for (const column in req.body) {
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
      console.log(error);        
      return res.status(400).send(error);
    }

    res.status(201);
    res.send(results);
  });
}


function putRow(tableName, req, res, keys) {
  let sql = 'UPDATE ' + tableName + ' SET ';

  const inserts = [];
  let index = 0;

  for (const name in req.body) {
    inserts.push(name);
    inserts.push(req.body[name]);

    if (index > 0)
      sql += ', ';

    sql += '?? = ?';
    index++;
  }

  index = 0;

  for (const name in keys) {
    inserts.push(name);
    inserts.push(keys[name]);

    if (index == 0)
      sql += ' WHERE ';
    else
      sql += ' AND ';

    sql += '??=?';
    index++;
  }

  console.log(sql);
  console.log(inserts);

  connection.query(sql, inserts, (error, results, fields) => {
    if (error) {
      console.log(error);        
      return res.status(400).send(error);
    }

    res.send(results);
  });
}


function deleteRow(tableName, req, res, keys) {
  let sql = 'DELETE FROM ' + tableName;

  const inserts = [];
  let index = 0;

  for (const name in keys) {
    inserts.push(name);
    inserts.push(keys[name]);

    if (index == 0)
      sql += ' WHERE ';
    else
      sql += ' AND ';

    sql += '??=?';
    index++;
  }

  console.log(sql);
  console.log(inserts);

  connection.query(sql, inserts, (error, results, fields) => {
    if (error) {
      console.log(error);        
      return res.status(400).send(error);
    }

    res.send(results);
  });
}


module.exports = {
  getRow,
  getRows,
  postRow,
  putRow,
  deleteRow
}
