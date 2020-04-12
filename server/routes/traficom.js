const express = require('express');
const router = express.Router();


class Vehicle {
  constructor(registrationNumber, description, registrationYear, carMake, carModel, fuelType, engineSize, engineCode, power, netWeight, vechileIdentificationNumber) {
    this.registrationNumber = registrationNumber;
    this.description = description;
    this.registrationYear = registrationYear;
    this.carMake = carMake;
    this.carModel = carModel;
    this.fuelType = fuelType;
    this.engineSize = engineSize;
    this.engineCode = engineCode;
    this.power = power;
    this.netWeight = netWeight;
    this.vechileIdentificationNumber = vechileIdentificationNumber;
  }
}


const vehicles = [];
vehicles.push(new Vehicle('ZLP-833', 'Seat LEON ST', 2017, 'Seat', 'LEON ST', 'bensiini',  999, 'CHZD', 85, 1236, 'VSSZZZ5FZHR046587'));
vehicles.push(new Vehicle('ISI-560', 'Ford Focus',   2005, 'Ford', 'FOCUS',   'bensiini', 1596, 'HWDA', 74, 1277, 'WF0WXXGCDW5B88909'));


router.get('/:registrationNumber', (req, res) => {
  for (const vehicle of vehicles)
    if (vehicle.registrationNumber === req.params.registrationNumber)
      return res.send(vehicle);

  res.status(404).send('Registration number not found');
});


module.exports = router;
