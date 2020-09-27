function date(value) {
  return value.substring(0, 10);
}

function copyKoulu(source, destination) {
  source.query('SELECT * FROM Koulu')
    .then(data => {
      for (const item of data) {
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

        console.log(row);
        destination.insert('UserGroup', row);
      }
    })
    .catch(error => {
      console.error(error);
    });
}

module.exports = copyKoulu;
 