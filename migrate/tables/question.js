function date(value) {
  return value.substring(0, 10);
}

function int(value) {
  value && !isNaN(value) ? parseInt(value) : undefined;
}

function insertQuestions(destination, henkilot, questions) {
  for (const item of questions) {
    const henkilo = henkilot.find(h => h.O_ID === item.HQ_O_ID);
    let UserId = item.HQ_O_ID;

    if (!henkilo)
      UserId = 1;

    let Date = date(item.HQ_DATE1);

    if (Date === '1899-12-31')
      Date = '2000-01-01';
  
    const row = {
      Id: item.HQ_ID,
      UserId,
      Date,
      Make: item.HQ_MERKKI,
      Model: item.HQ_MALLI,
      ModelYear: int(item.HQ_VUOSIMALLI),
      RegistrationNumber: item.HQ_REKNRO,
      VIN: item.HQ_ALNRO,
      MID: item.HQ_MID,
      EngineSize: int(item.HQ_CM3),
      FuelType: item.HQ_KVOIMA ? (item.HQ_KVOIMA === 'D' ? 1 : 0) : undefined,
      Info: item.HQ_ERITYIS,
      Title: item.HQ_TITLE,
      Description: item.HQ_ONGELMA,
      DescriptionFile: item.HQ_FILE1,
      Solution: item.HQ_RATKAISU,
      SolutionFile: item.HQ_FILE2,
      SolutionDate: item.HQ_DATE2 ? date(item.HQ_DATE2) : undefined,
      Status: item.HQ_STATUS
    }

    destination.insert('Question', row);
  }
}

module.exports = insertQuestions;
 