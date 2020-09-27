function role(type) {
  switch (type) {
    case '-1': return 0;
    case '0': return 1;
  }

  return 2;
}

function groupExists(id) {
  return id === 159234761 ||
    id === 159235295 ||
    id === 189121195 ||
    id === 189441952 ||
    id === 190201640 ||
    id === 190559777 ||
    id === 284292166;
}

function copyHenkilo(source, destination) {
  source.query('SELECT * FROM Henkilo')
    .then(data => {
      for (const item of data) {
        let Id = item.O_ID;

        let GroupId = item.C_ID;

        if (!groupExists(GroupId))
          GroupId = 159234761;

        const FirstName = item.O_NIMI;
        const LastName = item.O_NIMI;

        const row = {
          Id,
          GroupId,
          Role: role(item.O_ID),
          Email: item.O_USER,
          Password: item.O_PSW,
          FirstName,
          LastName
        }

        console.log(row);
        destination.insert('User', row);
      }
    })
    .catch(error => {
      console.error(error);
    });
}

module.exports = copyHenkilo;
 