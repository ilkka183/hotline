function date(value) {
  return value.substring(0, 10);
}

function insertKoulut(destination, items) {
  for (const item of items) {
    const row = {
      Id: item.C_ID,
      Tunnus: item.C_TUNNUS,
      Name: item.C_NIMI,
      Address: item.C_OSOITE,
      Url: item.C_URL,
      Class: item.C_CLASS,
      LogoText: item.C_LOGO_TXT,
      LogoFile: item.C_LOGO_FILE,
      LicenseBegin: date(item.C_PVM1),
      LicenseEnd: date(item.C_PVM2)
    }

    destination.insert('UserGroup', row);
  }
}

module.exports = insertKoulut;
 