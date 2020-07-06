const connection = require('../connection');


function sendNotFound(res) {
  const message = 'Item not found';
  console.log(message);
  return res.status(404).send(message);
}


function getRow(sql, req, res) {
  console.log(sql);

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.log(error);        
      return res.status(400).send(error);
    }

    if (results.length === 0)
      return sendNotFound(res);

    res.send(results[0]);
  });
}


function getRows(sql, req, res) {
  console.log(sql);

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.log(error);        
      return res.status(400).send(error);
    }

    res.send(results);
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

    const response = {
      Id: results.insertId,
      ...req.body
    }

    res.status(201).send(response);
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

    if (results.affectedRows === 0)
      return sendNotFound(res);

    const response = { ...req.body }

    res.send(response);
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

    if (results.affectedRows === 0)
      return sendNotFound(res);

    res.send('Success');
  });
}


module.exports = {
  getRow,
  getRows,
  postRow,
  putRow,
  deleteRow
}