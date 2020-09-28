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
  
    destination.insert('User', row);
  }
}

module.exports = insertHenkilot;
 