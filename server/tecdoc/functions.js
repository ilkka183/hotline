const AUDI_MODELS = require('./makes/audi');
const BMW_MODELS = require('./makes/bmw');
const FORD_MODELS = require('./makes/ford');
const SEAT_MODELS = require('./makes/seat');
const VOLKSWAGEN_MODELS = require('./makes/volkswagen');


const AUDI = 5;
const BMW = 16;
const FORD = 1;
const SEAT = 2;
const VOLKSWAGEN = 3;


const MANUFACTURERS = [
  {
    manuId: AUDI,
    manuName: 'AUDI'
  },
  {
    manuId: BMW,
    manuName: 'BMW'
  },
  {
    manuId: FORD,
    manuName: 'Ford'
  },
  {
    manuId: SEAT,
    manuName: 'SEAT'
  },
  {
    manuId: VOLKSWAGEN,
    manuName: 'Volkswagen'
  }
];


function getManufacturers() {
  return MANUFACTURERS;
}


function getModelSeries(manuId) {
  switch (manuId) {
    case AUDI: return AUDI_MODELS;
    case BMW: return BMW_MODELS;
    case FORD: return FORD_MODELS;
    case SEAT: return SEAT_MODELS;
    case VOLKSWAGEN: return VOLKSWAGEN_MODELS;
  }

  return [];
}


module.exports = {
  getManufacturers,
  getModelSeries
}
