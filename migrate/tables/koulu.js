function date(value) {
  return value.substring(0, 10);
}

function insertKoulut(destination, items, henkilot) {
  for (const item of items) {
    const pvm1 = date(item.C_PVM1);
    const pvm2 = date(item.C_PVM2);
  
    const henkilo = henkilot.find(h => h.O_USER === item.CHNGBY);

    const row = {
      Id: item.C_ID,
      Tunnus: item.C_TUNNUS,
      Name: item.C_NIMI,
      Address: item.C_OSOITE,
      Url: item.C_URL,
      LicenseBegin: pvm1 !== '1899-12-31' ? pvm1 : undefined,
      LicenseEnd: pvm2 !== '1899-12-31' ? pvm2 : undefined,
      Class: item.C_CLASS,
      LogoText: item.C_LOGO_TXT,
      LogoFile: item.C_LOGO_FILE,
      UpdatedBy: henkilo.O_ID,
      UpdatedAt: date(item.CHNGDATE)
    }

    destination.insert('UserGroup', row);
  }
}

module.exports = insertKoulut;
 