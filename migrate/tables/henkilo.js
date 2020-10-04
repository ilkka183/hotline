function role(type) {
  switch (type) {
    case '-1': return 0;
    case '0': return 1;
  }

  return 2;
}

function insertHenkilot(destination, koulut, henkilot) {
  for (const item of henkilot) {
    let Id = item.O_ID;

    let GroupId = item.C_ID;
    const koulu = koulut.find(k => k.C_ID === item.C_ID);
  
    if (!koulu)
      GroupId = 159234761;
  
    const names = item.O_NIMI.split(' ');
    let FirstName = '';
    let LastName = '';

    if (names.length > 0)
      FirstName = names[0];
  
    for (let i = 1; i < names.length; i++) {
      if (i > 1)
        LastName += ' ';

      LastName += names[i];
    }
  
    const row = {
      Id,
      GroupId,
      Role: role(item.O_ID),
      Email: item.O_USER,
      Password: item.O_PSW,
      FirstName,
      LastName
    }
  
    destination.insert('User', row);
  }
}

module.exports = insertHenkilot;
 