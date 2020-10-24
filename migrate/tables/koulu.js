function date(value) {
  const date = value.substring(0, 10);

  return date !== '1899-12-31' ? date : undefined;
}

function text(value) {
  return value ? value : undefined;
}

function insertKoulut(destination, items, henkilot) {
  for (const item of items) {
    const henkilo = henkilot.find(h => h.O_USER === item.CHNGBY);

    const row = {
      Id: item.C_ID,
      Tunnus: item.C_TUNNUS,
      Name: item.C_NIMI,
      Address: text(item.C_OSOITE),
      Url: text(item.C_URL),
      LicenseBegin: date(item.C_PVM1),
      LicenseEnd: date(item.C_PVM2),
      Class: text(item.C_CLASS),
      LogoText: text(item.C_LOGO_TXT),
      LogoFile: text(item.C_LOGO_FILE),
      UpdatedBy: henkilo.O_ID,
      UpdatedAt: date(item.CHNGDATE)
    }

    destination.insert('UserGroup', row);
  }
}

module.exports = insertKoulut;
 