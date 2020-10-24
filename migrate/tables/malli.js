function text(value) {
  return value ? value : undefined;
}

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
      Name: text(item.T_3),
      Grouping: text(item.T_4),
      AdditionalInfo: text(item.T_5),
      Sequence: text(item.T_6),
      EngineSize: 1000*parseFloat(item.T_7.replace(',', '.')),
      EngineCode: text(item.T_8),
      EnginePower: power ? power.value : undefined,
      EnginePowerAt: power ? power.at : undefined,
      Tune: text(item.T_10),
      StartYear: parseInt(item.T_11),
      EndYear: parseInt(item.T_12),
      MID: text(item.T_13),
      FuelType: item.T_14 === 'P' ? 0 : 1,
      VehicleType: parseInt(item.T_15),
    }

    destination.insert('Model', row);
  }
}

module.exports = insert;
 