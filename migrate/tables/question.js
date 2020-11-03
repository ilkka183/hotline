function date(value) {
  const date = value.substring(0, 10);

  return date !== '1899-12-31' ? date : undefined;
}

function int(value) {
  return (value && !isNaN(value)) ? parseInt(value) : undefined;
}

function text(value) {
  return value ? value : undefined;
}

function getEngineSize(value) {
  let comma = false;
  let str = '';

  for (const c of value) {
    if (c === '.' || c === ',')
      comman = true;
    else if (c >= '0' && c <= '9')
      str += c;
  }

  if (str === '')
    return undefined;

  const number = parseInt(str);

  if (comma)
    number *= 100;

  return number;
}

function insertQuestions(destination, henkilot, questions) {
  for (const item of questions) {
    const henkilo = henkilot.find(h => h.O_ID === item.HQ_O_ID);
    let UserId = item.HQ_O_ID;

    if (!henkilo)
      UserId = 1;

    let Date = date(item.HQ_DATE1);

    if (!Date)
      Date = '2000-01-01';

    let Tags = '';

    if (item.HQ_MALLI)
      Tags += 'MALLI: ' + item.HQ_MALLI + '\n';
  
    if (item.HQ_VUOSIMALLI)
      Tags += 'VUOSIMALLI: ' + item.HQ_VUOSIMALLI + '\n';
  
    if (item.HQ_MTYYPPI)
      Tags += 'MTYYPPI: ' + item.HQ_MTYYPPI + '\n';
  
    if (item.HQ_CM3)
      Tags += 'CM3: ' + item.HQ_CM3 + '\n';
  
    if (item.HQ_MID)
      Tags += 'MID: ' + item.HQ_MID + '\n';
  
    const row = {
      Id: item.HQ_ID,
      UserId,
      Date,
      Make: item.HQ_MERKKI,
      RegistrationNumber: text(item.HQ_REKNRO),
      VIN: text(item.HQ_ALNRO),
      FuelType: item.HQ_KVOIMA ? (item.HQ_KVOIMA === 'D' ? 1 : 0) : undefined,
      Info: text(item.HQ_ERITYIS),
      Tags,
      Title: item.HQ_TITLE,
      Description: item.HQ_ONGELMA,
      DescriptionFile: text(item.HQ_FILE1),
      Solution: text(item.HQ_RATKAISU),
      SolutionFile: text(item.HQ_FILE2),
      SolutionDate: date(item.HQ_DATE2),
      Status: item.HQ_STATUS
    }

    destination.insert('Question', row);
  }
}

module.exports = insertQuestions;
 