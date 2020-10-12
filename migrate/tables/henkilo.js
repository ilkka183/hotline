function date(value) {
  return value.substring(0, 10);
}

function datetime(value) {
  return value.substring(0, 10) + ' ' + value.substring(11, 19);
}

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

    const pvm1 = date(item.O_PVM1);
    const pvm2 = date(item.O_PVM2);

    const henkilo = henkilot.find(h => h.O_USER === item.CHNGBY);
  
    const row = {
      Id,
      GroupId,
      FirstName,
      LastName,
      Email: item.O_EMAIL,
      Username: item.O_USER,
      Password: item.O_PSW,
      Info: item.O_MEMO,
      Role: role(item.O_TYPE),
      LastLogin: datetime(item.O_LOGIN),
      LastLogout: datetime(item.O_LOGOUT),
      Language: item.O_LANGUAGE,
      CompanyName: item.O_CNAME,
      Title: item.O_TITLE,
      Address: item.O_STREET,
      PostOfficeBox: item.O_BOX,
      PostalCode: item.O_ZIP,
      PostOffice: item.O_CITY,
      Country: item.O_COUNTRY,
      Phone: item.O_PHONE,
      Fax: item.O_FAX,
      Class: item.O_CLASS,
      LicenseBegin: pvm1 !== '1899-12-31' ? pvm1 : undefined,
      LicenseEnd: pvm2 !== '1899-12-31' ? pvm2 : undefined,
      UpdatedBy: henkilo ? henkilo.O_ID : undefined,
      UpdatedAt: date(item.CHNGDATE)
    }
  
    destination.insert('User', row);
  }
}

module.exports = insertHenkilot;
 