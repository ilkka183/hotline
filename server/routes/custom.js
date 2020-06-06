const express = require('express');
const connection = require('../connection');

const router = express.Router();


function fetchRow(sql, req, res) {
  console.log(sql);

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.log(error);        
      return res.status(400).send(error);
    }

    res.send(results);
  });
}

function fetchRows(sql, req, res) {
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

router.get('/UserGroups', (req, res) => {
  const sql =
    'SELECT Id, Name, ContactPerson,' +
    'Address, PostalCode, PostOffice, Country, Phone, Email, Website, ' +
    'Logo, Info, Enabled ' +
    'FROM UserGroup ' +
    'ORDER BY Id';

  fetchRows(sql, req, res);
});

router.get('/Users', (req, res) => {
  const sql =
    'SELECT User.Id, User.GroupId, User.Email, User.Password, ' + 
    'UserGroup.Name AS GroupName, User.Role, User.FirstName, User.LastName, User.Title, ' +
    'User.Address, User.PostalCode, User.PostOffice, User.Country, User.Phone, User.Website, ' +
    'User.Info, User.LicenseBegin, User.LicenseEnd, User.Enabled ' +
    'FROM User, UserGroup ' +
    'WHERE User.GroupId = UserGroup.Id ' +
    'ORDER BY User.Id';

  fetchRows(sql, req, res);
});

router.get('/Brands', (req, res) => {
  const sql = 'SELECT Id, Name, Logo, Info, Enabled FROM Brand ORDER BY Id';

  fetchRows(sql, req, res);
});

router.get('/BulletinGroups', (req, res) => {
  const sql = 'SELECT Id, Name, Enabled FROM BulletinGroup ORDER BY Id';

  fetchRows(sql, req, res);
});

router.get('/Problem', (req, res) => {
  let sql =
    'SELECT Problem.Id, Problem.Date, Problem.UserId, CONCAT(User.FirstName, " ", User.LastName) AS UserName, ' +
    'Problem.LicenseNumber, Problem.Brand, Problem.Model, Problem.YearMin, Problem.YearMax, Problem.Fuel, Problem.Title, Problem.Description, Problem.Status ' +
    'FROM Problem, User ' +
    'WHERE Problem.UserId = User.Id ' + 
    'AND Problem.Id = ' + req.query.Id;

  fetchRow(sql, req, res);
});

router.get('/Problems', (req, res) => {
  let sql =
    'SELECT Problem.Id, Problem.Date, CONCAT(User.FirstName, " ", User.LastName) AS UserName, ' +
    'Problem.LicenseNumber, Problem.Brand, Problem.Model, Problem.YearMin, Problem.YearMax, Problem.Fuel, Problem.Title, Problem.Description, Problem.Status ' +
    'FROM Problem, User ' +
    'WHERE Problem.UserId = User.Id ';

  if (req.query.search) {
    sql += 'AND (Problem.Brand LIKE "%' + req.query.search + '%" ';
    sql += 'OR Problem.Model LIKE "%' + req.query.search + '%" ';
    sql += 'OR Problem.Title LIKE "%' + req.query.search + '%" ';
    sql += 'OR Problem.Description LIKE "%' + req.query.search + '%") ';
  }

  if (req.query.status)
    sql += 'AND Problem.Status = ' + req.query.status + ' ';

  sql += 'ORDER BY Problem.Id DESC';

  fetchRows(sql, req, res);
});

router.get('/ProblemReplies', (req, res) => {
  let sql =
    'SELECT ProblemReply.Id, ProblemReply.ProblemId, ProblemReply.Date, ProblemReply.UserId, CONCAT(User.FirstName, " ", User.LastName) AS UserName, ' +
    'ProblemReply.Message, ProblemReply.Solution ' +
    'FROM ProblemReply, User ' +
    'WHERE ProblemReply.UserId = User.Id AND ProblemReply.ProblemId = ' + req.query.ProblemId + ' ' +
    'ORDER BY ProblemReply.Date';

  fetchRows(sql, req, res);
});

router.get('/Notices', (req, res) => {
  let sql =
    'SELECT Notice.Id, Notice.Date, CONCAT(User.FirstName, " ", User.LastName) AS UserName, Notice.Title, Notice.Message ' +
    'FROM Notice, User ' +
    'WHERE Notice.UserId = User.Id ';

  if (req.query.search) {
    sql += 'AND (Notice.Title LIKE "%' + req.query.search + '%" ';
    sql += 'OR Notice.Message LIKE "%' + req.query.search + '%") ';
  }

  sql += 'ORDER BY Notice.Id';

  fetchRows(sql, req, res);
});

module.exports = router;
