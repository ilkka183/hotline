const vehicles = [
  {
    registrationNumber: 'ZLP-833',
    registrationYear: 2017,
    carMake: 'Seat',
    carModel: 'Leon ST',
    fuelType: 'bensiini',
    cylinderCount: 3,
    engineSize: 999,
    power: 85,
    engineCode: 'CHZD',
    vechileIdentificationNumber: 'VSSZZZ5FZHR046587',
    netWeight: 1236,
    grossWeight: 1770
  },
  {
    registrationNumber: 'ISI-561',
    registrationYear: 2005,
    carMake: 'VW',
    carModel: 'Golf',
    fuelType: 'bensiini',
    cylinderCount: 4,
    engineSize: 1596,
    power: 74,
    engineCode: 'CHZD',
    vechileIdentificationNumber: 'WF0WXXGCDW5B88909',
    netWeight: 1277,
    grossWeight: 1770
  },
  {
    registrationNumber: 'SIO-913',
    registrationYear: 1999,
    carMake: 'Ford',
    carModel: 'Focus',
    fuelType: 'diesel',
    cylinderCount: 4,
    engineSize: 1769,
    power: 66,
    engineCode: 'HWDA',
    vechileIdentificationNumber: 'WVWZZZ1JZ5W079439',
    netWeight: 1415,
    grossWeight: 1770
  }
];

function getTest(registrationNumber) {
  for (const vehicle of vehicles)
    if (vehicle.registrationNumber === registrationNumber)
      return vehicle;

  throw 'Registration number not found';
}

module.exports = { getTest };
