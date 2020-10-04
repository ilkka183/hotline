function date(value) {
  return value.substring(0, 10);
}

function insertAnswers(destination, henkilot, questions, answers) {
  for (const item of answers) {
    const question = questions.find(q => q.HQ_ID === item.HQ_ID);

    if (!question)
      continue;

    const henkilo = henkilot.find(h => h.O_ID === item.HA_O_ID);
    let UserId = item.HA_O_ID;

    if (!henkilo)
      UserId = 1;

    let Date = date(item.HA_DATE2);

    if (Date === '1899-12-31')
      Date = '2000-01-01';

    const row = {
      Id: item.HA_ID,
      QuestionId: item.HQ_ID,
      UserId,
      Date,
      Message: item.HA_VASTAUS,
      File: item.HA_FILE2
    }

    destination.insert('Answer', row);
  }
}

module.exports = insertAnswers;
 