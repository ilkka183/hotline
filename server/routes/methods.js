const connection = require('../connection');

function sendNotFound(res) {
  return res.status(404).send('Item not found');
}

function sql(table, id) {
  return 'SELECT * FROM ' + table + ' WHERE Id = ' + id;
}

function trim(sql) {
  const index = sql.indexOf('FROM ');

  if (index !== -1)
    return 'SELECT ... ' + sql.substring(index);

  return sql
}

function getFilter(req) {
  let sql = '';

  for (const key in req.query)
    if (key !== 'pageIndex' && key !== 'pageSize') {
      if (sql.length > 0)
        sql += ' AND ';

      sql += key + ' LIKE "%' + req.query[key] + '%"';
    }

  return sql;
}

function getCountSql(req, sql) {
  const fromIndex = sql.indexOf('FROM ');

  if (fromIndex !== -1) {
    sql = sql.substring(fromIndex);

    const orderByIndex = sql.lastIndexOf('ORDER BY ');

    if (orderByIndex !== -1)
      sql = sql.substring(0, orderByIndex);

/*    const filterSql = getFilter(req);

    if (filterSql) {
      const whereIndex = sql.indexOf('WHERE');

      if (whereIndex !== -1)
        sql += " AND ";
      else
        sql += " WHERE ";

      sql += filterSql;
    } */

    return 'SELECT COUNT(*) AS Count ' + sql;
  }

  return null
}

async function getRow(req, res, sql) {
  console.log(trim(sql));

  try {
    const { results } = await connection.query(sql);

    if (results.length === 0)
      return sendNotFound(res);

    res.send(results[0]);
  }
  catch (ex) {
    console.error(ex);
    res.status(500).send(ex);
  }
}

async function getRows(req, res, sql) {
  try {
    const pageIndex = req.query.pageIndex;
    const pageSize = req.query.pageSize;

    const countSql = pageSize ? getCountSql(req, sql) : null;

/*    const filterSql = getFilter(req);

    if (filterSql) {
      const whereIndex = sql.indexOf('WHERE');

      if (whereIndex !== -1)
        sql += " AND ";
      else
        sql += " WHERE ";

      sql += filterSql;
    } */

    const sortFields = req.query.sortFields;

    if (sortFields) {
      sql += ' ORDER BY';

      const count = parseInt(sortFields);

      for (let i = 1; i <= count; i++) {
        if (i > 1)
          sql += ',';

        sql += ' ';

        const sortName = req.query['sortName' + i];
        const sortOrder = req.query['sortOrder' + i];
  
        sql += sortName;
  
        if (sortOrder) {
          sql += ' ';
          sql += sortOrder.toUpperCase();
        }
      }
    }

    if (pageSize) {
      sql += ' LIMIT ';

      if (pageIndex) {
        const offset = pageIndex*pageSize;
        sql += offset + ', ';
      }

      sql += pageSize;

      console.log(countSql);
      console.log(trim(sql));

      const { results: count } = await connection.query(countSql);
      const { results: rows } = await connection.query(sql);

      const response = {
        rowCount: count[0].Count,
        rows
      }

      res.send(response);
    }
    else {
      console.log(trim(sql));

      const { results: rows } = await connection.query(sql);

      const response = {
        rowCount: rows.length,
        rows
      }

      res.send(response);
    }
  }
  catch (ex) {
    console.error(ex);
    res.status(500).send(ex);
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
    const { results, fields } = await connection.queryValues(sql, inserts);

    const response = {
      Id: results.insertId,
      ...fields
    }

    res.status(201).send(response);
  }
  catch (ex) {
    console.error(ex);
    res.status(500).send(ex);
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
    const { results, fields } = await connection.queryValues(sql, inserts);

    if (results.affectedRows === 0)
      return sendNotFound(res);

    const response = { ...fields }

    res.send(response);
  }
  catch (ex) {
    console.error(ex);
    res.status(500).send(ex);
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
    const { results } = await connection.queryValues(sql, inserts);

    if (results.affectedRows === 0)
      return sendNotFound(res);

    res.send('Success');
  }
  catch (ex) {
    console.error(ex);
    res.status(500).send(ex);
  }
}


module.exports = {
  sql,
  trim,
  getRow,
  getRows,
  postRow,
  putRow,
  deleteRow
}
