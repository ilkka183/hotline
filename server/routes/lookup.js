const express = require('express');
const connection = require('../connection');

const router = express.Router();


function fetch(sql, req, res) {
  console.log(sql);

  connection.query(sql, (error, results, fields) => {
    if (error)
      return res.status(400).send(error);

      console.log(results);
      res.send(results);
  });
}


router.get('/Users', (req, res) => {
  fetch("SELECT Id, CONCAT(FirstName, ' ', LastName) AS Text FROM User ORDER BY Text", req, res);
});


router.get('/UserGroups', (req, res) => {
  fetch("SELECT Id, Name AS Text FROM UserGroup ORDER BY Text", req, res);
});


module.exports = router;
