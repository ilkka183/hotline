const express = require('express');
const { getRow, getRows} = require('./utils');

const router = express.Router();


router.get('/UserGroups', (req, res) => {
  const sql = 
    'SELECT Id, Name, ContactPerson,' +
    'Address, PostalCode, PostOffice, Country, Phone, Email, Website, ' +
    'Logo, Info, Enabled ' +
    'FROM UserGroup ' +
    'ORDER BY Id';

  getRows(sql, req, res);
});

router.get('/Users', (req, res) => {
  const sql =
    'SELECT User.Id, User.GroupId, UserGroup.Name AS GroupName, User.Email, User.Password, ' + 
    'User.Role, User.FirstName, User.LastName, User.Title, ' +
    'User.Address, User.PostalCode, User.PostOffice, User.Country, User.Phone, User.Website, ' +
    'User.Info, User.LicenseBegin, User.LicenseEnd, User.Enabled ' +
    'FROM User, UserGroup ' +
    'WHERE User.GroupId = UserGroup.Id ' +
    'ORDER BY User.Id';

  getRows(sql, req, res);
});

router.get('/Brands', (req, res) => {
  const sql = 'SELECT Id, Name, Logo, Info, Enabled FROM Brand ORDER BY Id';

  getRows(sql, req, res);
});

router.get('/BulletinGroups', (req, res) => {
  const sql = 'SELECT Id, Name, Enabled FROM BulletinGroup ORDER BY Id';

  getRows(sql, req, res);
});

router.get('/Problem', (req, res) => {
  let sql =
    'SELECT Problem.Id, Problem.Date, Problem.UserId, CONCAT(User.FirstName, " ", User.LastName) AS UserName, ' +
    'Problem.LicenseNumber, Problem.Brand, Problem.Model, Problem.YearMin, Problem.YearMax, Problem.Fuel, Problem.Title, Problem.Description, Problem.Status ' +
    'FROM Problem, User ' +
    'WHERE Problem.UserId = User.Id ' + 
    'AND Problem.Id = ' + req.query.Id;

    getRow(sql, req, res);
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

  getRows(sql, req, res);
});

router.get('/ProblemReplies', (req, res) => {
  let sql =
    'SELECT ProblemReply.Id, ProblemReply.ProblemId, ProblemReply.Date, ProblemReply.UserId, CONCAT(User.FirstName, " ", User.LastName) AS UserName, ' +
    'ProblemReply.Message, ProblemReply.Solution ' +
    'FROM ProblemReply, User ' +
    'WHERE ProblemReply.UserId = User.Id AND ProblemReply.ProblemId = ' + req.query.ProblemId + ' ' +
    'ORDER BY ProblemReply.Date';

  getRows(sql, req, res);
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

  getRows(sql, req, res);
});

module.exports = router;
