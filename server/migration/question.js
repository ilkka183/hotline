function date(value) {
  return value.substring(0, 10);
}

function copyKoulu(source, destination) {
  source.query('SELECT * FROM HL_Question')
    .then(data => {
      for (const item of data) {
        let UserId = item.HQ_O_ID;

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

        console.log(row);
        destination.insert('Question', row);
      }
    })
    .catch(error => {
      console.error(error);
    });
}

module.exports = copyKoulu;
 