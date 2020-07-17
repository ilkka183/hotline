const express = require('express');
const router = express.Router();


router.get('/makes', (req, res) => {
  const list = [];

  list.push('Audi');
  list.push('Ford');
  list.push('Seat');
  list.push('Skoda');
  list.push('Volkswagen');

  res.send(list);
});


router.get('/modelYears', (req, res) => {
  const make = req.query.make;

  const list = [];

  switch (make) {
    case 'Ford':
      list.push(2009);
      list.push(2008);
      list.push(2007);
      list.push(2006);
      break;

    case 'Seat':
      list.push(2019);
      list.push(2018);
      list.push(2017);
      list.push(2016);
      break;

    case 'Volkswagen':
      list.push(2005);
      list.push(2004);
      list.push(2003);
      list.push(2002);
      break;
  }

  res.send(list);
});


router.get('/fuelTypes', (req, res) => {
  const make = req.query.make;

  const list = [];

  switch (make) {
    case 'Ford':
      list.push(0);
      list.push(1);
      break;

    case 'Seat':
      list.push(0);
      list.push(1);
      break;

    case 'Volkswagen':
      list.push(0);
      list.push(1);
      break;
  }

  res.send(list);
});


router.get('/models', (req, res) => {
  const make = req.query.make;

  const list = [];

  switch (make) {
    case 'Ford':
      list.push('Fiesta');
      list.push('Focus');
      list.push('Mondeo');
      break;

    case 'Seat':
      list.push('Ibiza');
      list.push('Leon');
      list.push('Ateca');
      list.push('Tarraco');
      break;

    case 'Volkswagen':
      list.push('Polo');
      list.push('Golf');
      list.push('Passat');
      break;
  }

  res.send(list);
});


router.get('/engineSizes', (req, res) => {
  const make = req.query.make;

  const list = [];

  switch (make) {
    case 'Ford':
      list.push(999);
      list.push(1499);
      list.push(1999);
      break;

    case 'Seat':
      list.push(999);
      list.push(1399);
      list.push(1499);
      list.push(1999);
      break;

    case 'Volkswagen':
      list.push(999);
      list.push(1399);
      list.push(1499);
      list.push(1999);
      break;
  }

  res.send(list);
});


module.exports = router;
