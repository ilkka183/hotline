const express = require('express');
const tecdoc = require('../tecdoc/functions');
const router = express.Router();

router.get('/getManufacturers', (req, res) => {
  return res.send(tecdoc.getManufacturers());
});

router.get('/getModelSeries', (req, res) => {
  const { manuId } = req.query;

  return res.send(tecdoc.getModelSeries(parseInt(manuId)));
});

module.exports = router;
