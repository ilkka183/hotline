const connection = require('../connection');


function sendNotFound(res) {
  const message = 'Item not found';
  console.log(message);
  return res.status(404).send(message);
}


function sql(table, id) {
  return 'SELECT * FROM ' + table + ' WHERE Id = ' + id;
}


function getRow(req, res, sql) {
  console.log(sql);

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.log(error);        
      return res.status(400).send(error);
    }

    if (results.length === 0)
      return sendNotFound(res);

      console.log(results[0]);
      res.send(results[0]);
    });
}


function getRows(req, res, sql) {
  console.log(sql);

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.log(error);        
      return res.status(400).send(error);
    }

    res.send(results);
  });
}


function postRow(req, res, tableName) {
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

    const response = {
      Id: results.insertId,
      ...fields
    }

    res.status(201).send(response);
  });
}


function putRow(req, res, tableName, keys) {
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

    if (results.affectedRows === 0)
      return sendNotFound(res);

    const response = { ...fields }

    res.send(response);
  });
}


function deleteRow(req, res, tableName, keys) {
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

    if (results.affectedRows === 0)
      return sendNotFound(res);

    res.send('Success');
  });
}


module.exports = {
  sql,
  getRow,
  getRows,
  postRow,
  putRow,
  deleteRow
}
