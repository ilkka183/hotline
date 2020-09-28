function date(value) {
  return value.substring(0, 10);
}

function insertQuestions(destination, henkilot, questions) {
  for (const item of questions) {
    let UserId = item.HQ_O_ID;

    const henkilo = henkilot.find(h => h.O_ID === item.HQ_O_ID);
  
    if (!henkilo)
      UserId = 1;

    const row = {
      Id: item.HQ_ID,
      Date: date(item.HQ_DATE1),
      UserId,
      Make: item.HQ_MERKKI,
      Model: item.HQ_MALLI,
      Title: item.HQ_TITLE,
      Description: item.HQ_ONGELMA
    }

    destination.insert('Question', row);
  }
}

module.exports = insertQuestions;
 