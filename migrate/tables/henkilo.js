function date(value) {
  const date = value.substring(0, 10);

  return date !== '1899-12-31' ? date : undefined;
}

function datetime(value) {
  const date = value.substring(0, 10);
  const time = value.substring(11, 19);

  return date !== '1899-12-31' ? date + ' ' + time : undefined;
}

function text(value) {
  return value ? value : undefined;
}

function role(type) {
  switch (type) {
    case '-1': return 0;
    case '0': return 1;
    case '1': return 1;
    case '1.5': return 1;
  }

  return 2;
}

function insertHenkilot(destination, koulut, henkilot) {
  for (const item of henkilot) {
    let Id = item.O_ID;

    let GroupId = item.C_ID;
    const koulu = koulut.find(k => k.C_ID === item.C_ID);
  
    if (!koulu)
      GroupId = 1;
  
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

    const henkilo = henkilot.find(h => h.O_USER === item.CHNGBY);
  
    const row = {
      Id,
      GroupId,
      FirstName,
      LastName,
      Email: item.O_EMAIL,
      Info: text(item.O_MEMO),
      Username: item.O_USER,
      Password: item.O_PSW,
      Role: role(item.O_TYPE),
      LastLogin: datetime(item.O_LOGIN),
      LastLogout: datetime(item.O_LOGOUT),
      Language: text(item.O_LANGUAGE),
      CompanyName: text(item.O_CNAME),
      Title: text(item.O_TITLE),
      Address: text(item.O_STREET),
      PostOfficeBox: text(item.O_BOX),
      PostalCode: text(item.O_ZIP),
      PostOffice: text(item.O_CITY),
      Country: text(item.O_COUNTRY),
      Phone: text(item.O_PHONE),
      Fax: text(item.O_TELEFAX),
      Class: text(item.O_CLASS),
      LicenseBegin: date(item.O_PVM1),
      LicenseEnd: date(item.O_PVM2),
      UpdatedBy: henkilo ? henkilo.O_ID : undefined,
      UpdatedAt: date(item.CHNGDATE)
    }
  
    destination.insert('User', row);
  }
}

module.exports = insertHenkilot;
 