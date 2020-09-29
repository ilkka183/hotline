function date(value) {
  return value.substring(0, 10);
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
      Title: item.HQ_TITLE,
      Description: item.HQ_ONGELMA,
      Solution: item.HQ_RATKAISU,
      Status: item.HQ_STATUS
    }

    destination.insert('Question', row);
  }
}

module.exports = insertQuestions;
 