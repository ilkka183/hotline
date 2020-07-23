const connection = require('../connection');


function sendNotFound(res) {
  const message = 'Item not found';
  console.log(message);
  return res.status(404).send(message);
}


function sql(table, id) {
  return 'SELECT * FROM ' + table + ' WHERE Id = ' + id;
}


async function getRow(req, res, sql) {
  console.log(sql);

  try {
    const data = await connection.query(sql);

    if (data.results.length === 0)
      return sendNotFound(res);

    return res.send(data.results[0]);
  }
  catch (ex) {
    console.error(ex);
    return res.status(400).send(ex.Error);
  }
}


async function getRows(req, res, sql) {
  console.log(sql);

  try {
    const data = await connection.query(sql);
    return res.send(data.results);
  }
  catch (ex) {
    console.error(ex);
    return res.status(400).send(ex.Error);
  }
}

async function postRow(req, res, tableName) {
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

  try {
    const data = await connection.queryValues(sql, inserts);

    const response = {
      Id: data.results.insertId,
      ...data.fields
    }

    return res.status(201).send(response);
  }
  catch (ex) {
    console.error(ex);
    return res.status(400).send(ex.Error);
  }
}

async function putRow(req, res, tableName, keys) {
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

  try {
    const data = await connection.queryValues(sql, inserts);

    if (data.results.affectedRows === 0)
      return sendNotFound(res);

    const response = { ...data.fields }

    return res.send(response);
  }
  catch (ex) {
    console.error(ex);
    return res.status(400).send(ex.Error);
  }
}

async function deleteRow(req, res, tableName, keys) {
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

  try {
    const data = await connection.queryValues(sql, inserts);

    if (data.results.affectedRows === 0)
      return sendNotFound(res);

    return res.send('Success');
  }
  catch (ex) {
    console.error(ex);
    return res.status(400).send(ex.Error);
  }
}


module.exports = {
  sql,
  getRow,
  getRows,
  postRow,
  putRow,
  deleteRow
}
