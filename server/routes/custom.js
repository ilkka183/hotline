const express = require('express');
const connection = require('../connection');

const router = express.Router();


function fetch(tableName, sql, req, res) {
  let countSql = 'SELECT COUNT(*) as RowCount FROM ' + tableName;

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
    'SELECT Id, Name, ' +
    'Address, PostalCode, PostOffice, Country, Phone, Email, Website, ' +
    'Logo, Info, Enabled ' +
    'FROM UserGroup ' +
    'ORDER BY Id';

  fetch('UserGroup', sql, req, res);
});

router.get('/Users', (req, res) => {
  const sql =
    'SELECT User.Id, User.GroupId, User.Username, User.Password, ' + 
    'UserGroup.Name AS GroupName, User.Role, User.FirstName, User.LastName, User.Title, ' +
    'User.Address, User.PostalCode, User.PostOffice, User.Country, User.Phone, User.Email, User.Website, ' +
    'User.Info, User.LicenseBegin, User.LicenseEnd, User.Enabled ' +
    'FROM User, UserGroup ' +
    'WHERE User.GroupId = UserGroup.Id ' +
    'ORDER BY User.Id';

  fetch('User', sql, req, res);
});

router.get('/Brands', (req, res) => {
  const sql = 'SELECT Id, Name, Logo, Info, Enabled FROM Brand ORDER BY Id';

  fetch('Brand', sql, req, res);
});

router.get('/BulletinGroups', (req, res) => {
  const sql = 'SELECT Id, Name, Enabled FROM BulletinGroup ORDER BY Id';

  fetch('BulletinGroup', sql, req, res);
});

router.get('/Problems', (req, res) => {
  let sql =
    'SELECT Problem.Id, Problem.Date, CONCAT(User.FirstName, " ", User.LastName) AS UserName, ' +
    'Problem.LicenseNumber, Problem.Brand, Problem.Model, Problem.ModelYear, Problem.Fuel, Problem.Title, Problem.Description, Problem.Status ' +
    'FROM Problem, User ' +
    'WHERE Problem.UserId = User.Id ';

  if (req.query.search) {
    sql += 'AND (Problem.Title LIKE "%' + req.query.search + '%" ';
    sql += 'OR Problem.Description LIKE "%' + req.query.search + '%") ';
  }

  if (req.query.status)
    sql += 'AND Problem.Status = ' + req.query.status + ' ';

  sql += 'ORDER BY Problem.Id';

  fetch('Problem', sql, req, res);
});

router.get('/ProblemReplies', (req, res) => {
  let sql =
    'SELECT ProblemReply.Id, ProblemReply.ProblemId, ProblemReply.Date, CONCAT(User.FirstName, " ", User.LastName) AS UserName, ProblemReply.Message ' +
    'FROM ProblemReply, User ' +
    'WHERE ProblemReply.UserId = User.Id AND ProblemReply.ProblemId = ' + req.query.ProblemId + ' ' +
    'ORDER BY ProblemReply.Date';

  fetch('ProblemReply', sql, req, res);
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

  fetch('Notice', sql, req, res);
});

module.exports = router;
