const express = require('express');
const bovSoft = require('../api/bovSoft');
const regCheck = require('../api/regCheck');
const test = require('../api/test');
const asyncMiddleware = require('../middleware/async');

const router = express.Router();

async function getVehicle(registrationNumber, source) {
  switch (source) {
    case 'BovSoftApi': return await bovSoft.getApi(registrationNumber);
    case 'BovSoftFile':  return await bovSoft.getFile(registrationNumber);
    case 'RegCheckApi': return await regCheck.getApi(registrationNumber);
    case 'RegCheckFile':  return await regCheck.getFile(registrationNumber);
  }

  return test.getTest(registrationNumber);
}

router.get('/:registrationNumber', asyncMiddleware(async (req, res) => {
  const vehicle = await getVehicle(req.params.registrationNumber, req.query.source);
  res.send(vehicle);
}));

module.exports = router;
