const connection = require('../connection');


function sendNotFound(res) {
  const message = 'Item not found';
  console.log(message);
  return res.status(404).send(message);
}


function getFields(req, acceptedFields) {
  const output = {};

  for (const name in req.body)
    if (acceptedFields.indexOf(name) !== -1)
      output[name] = req.body[name];

  return output;
}


function getRow(sql, res) {
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


function getRows(sql, res) {
  console.log(sql);

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.log(error);        
      return res.status(400).send(error);
    }

    res.send(results);
  });
}


function postRow(tableName, fields, res) {
  let sql = 'INSERT INTO ' + tableName + ' (';

  const columns = [];
  const values = [];

  let index = 0;

  for (const column in fields) {
    columns.push(column);
    values.push(fields[column]);

    if (index > 0)
      sql += ', ';

    sql += '??';
    index++;
  }

  sql += ') VALUES (';
  index = 0;

  for (const column in fields) {
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


function putRow(tableName, fields, keys, res) {
  let sql = 'UPDATE ' + tableName + ' SET ';

  const inserts = [];
  let index = 0;

  for (const name in fields) {
    inserts.push(name);
    inserts.push(fields[name]);

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


function deleteRow(tableName, keys, res) {
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
  getFields,
  getRow,
  getRows,
  postRow,
  putRow,
  deleteRow
}
