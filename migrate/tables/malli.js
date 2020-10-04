function getPower(text) {
  const values = text.split(' ');

  if (values.length === 3) {
    if ((values[0] !== '') && (values[2] !== ''))
      return {
        value: parseInt(values[0]),
        at: parseInt(values[2])
      }
  }

  return undefined;
}

function insert(destination, items) {
  for (const item of items) {
    const power = getPower(item.T_9);

    const row = {
      Id: item.T_ID,
      MakeId: item.M_ID,
      Name: item.T_3,
      Grouping: item.T_4,
      AdditionalInfo: item.T_5,
      Sequence: item.T_6,
      Tune: item.T_10,
      StartYear: parseInt(item.T_11),
      EndYear: parseInt(item.T_12),
      FuelType: item.T_14 === 'D' ? 1 : 0,
      VehicleType: parseInt(item.T_15),
      EngineSize: 1000*parseFloat(item.T_7.replace(',', '.')),
      EnginePower: power ? power.value : undefined,
      EnginePowerAt: power ? power.at : undefined,
      EngineCode: item.T_8,
      MID: item.T_13
    }

    destination.insert('Model', row);
  }
}

module.exports = insert;
 