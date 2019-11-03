const { TextAlign } = require('./dataset.js');
const { SqlTable } = require('./sql-dataset.js');


const fuels = [
  'Bensiini',
  'Diesel',
  'Kaasu',
  'Sähkö'
];


class BaseTable extends SqlTable {
  constructor(database, name) {
    super(database, name);

    if (this.constructor === BaseTable)
      throw new TypeError('Can not construct an abstract class');
  }
  
  addAddressFields() {
    this.addStringField('Address', 'Lähiosoite', { length: 80 });
    this.addStringField('PostalCode', 'Postinumero', { length: 10 });
    this.addStringField('PostOffice', 'Postitoimipaikka', { length: 40 });
    this.addStringField('Country', 'Maa', { length: 40 });
    this.addStringField('Phone', 'Puhelin', { length: 20 });
    this.addStringField('Email', 'Sähköposti', { length: 80, code: true });
    this.addStringField('Website', 'Kotisivut', { length: 80, code: true });
  }

  addInfoField() {
    this.addStringField('Info', 'Lisätietoja', { cols: 80, rows: 10 });
  }

  addStatusFields() {
    this.addBooleanField('Enabled', 'Voimassa', { default: true, required: true });
    this.addDateTimeField('CreatedAt', 'Luotu', { hideInGrid: true, readonly: true, required: true });
    this.addDateTimeField('UpdatedAt', 'Päivitetty', { hideInGrid: true, readonly: true });
  }

  getListCaption() {
    throw new TypeError('Can not call an abstract method');
  }

  getAddCaption() {
    throw new TypeError('Can not call an abstract method');
  }

  getEditCaption() {
    throw new TypeError('Can not call an abstract method');
  }

  getDeleteCaption() {
    throw new TypeError('Can not call an abstract method');
  }
}

export class ClientGroupTable extends BaseTable {
  constructor(database) {
    super(database, 'ClientGroup', 10);

    this.addAutoIncrementField('Id', 'No');
    this.addStringField('Name', 'Nimi', { length: 40, required: true });
    this.addAddressFields();
    this.addImageField('Logo', 'Logo');
    this.addInfoField();
    this.addStatusFields();
  }

  getListCaption() {
    return 'Käyttäjäryhmät';
  }

  getAddCaption() {
    return 'Lisää käyttäjäryhmä';
  }

  getEditCaption() {
    return 'Muokkaa käyttäjäryhmää';
  }

  getDeleteCaption() {
    return 'Poista käyttäjäryhmä';
  }
}

export class ClientTable extends BaseTable {
  constructor(database) {
    super(database, 'Client', 10);

    this.addAutoIncrementField('Id', 'No');
    this.addIntegerField('GroupId', 'Käyttäjäryhmä', { lookupSQL: "SELECT Id, Name AS Text FROM ClientGroup", foreignKey: true, required: true });
    this.addIntegerField('ClientType', 'Tyyppi', { displayTexts: ['Pääkäyttäjä', 'Tehokäyttäjä', 'Käyttäjä', 'Demokäyttäjä'], required: true });
    this.addStringField('Username', 'Käyttäjätunnus', { length: 20, hideInGrid: true, required: true });
    this.addStringField('Password', 'Salasana', { length: 20, hideInGrid: true, required: true });
    this.addStringField('FirstName', 'Etunimi', { length: 20, required: true });
    this.addStringField('LastName', 'Sukunimi', { length: 20, required: true });
    this.addStringField('Title', 'Toimenkuva', { length: 20 });
    this.addAddressFields();
    this.addInfoField();
    this.addDateField('LicenseBegin', 'Alku');
    this.addDateField('LicenseEnd', 'Loppu');
    this.addStatusFields();
  }

  getListCaption() {
    return 'Käyttäjät';
  }

  getAddCaption() {
    return 'Lisää käyttäjä';
  }

  getEditCaption() {
    return 'Muokkaa käyttäjää';
  }

  getDeleteCaption() {
    return 'Poista käyttäjä';
  }
}


export class BrandTable extends BaseTable {
  constructor(database) {
    super(database, 'Brand', 10);

    this.addAutoIncrementField('Id', 'No');
    this.addStringField('Name', 'Nimi', { length: 80, required: true });
    this.addImageField('Logo', 'Logo', { readonly: true });
    this.addInfoField();
    this.addStatusFields();
  }

  getListCaption() {
    return 'Automerkit';
  }

  getAddCaption() {
    return 'Lisää automerkki';
  }

  getEditCaption() {
    return 'Muokkaa automerkkiä';
  }

  getDeleteCaption() {
    return 'Poista automerkki';
  }
}


export class VehicleTable extends BaseTable {
  constructor(database) {
    super(database, 'Vehicle', 10);

    this.addStringField('LicenseNumber', 'Rekisterinumero', { length: 7, primaryKey: true, code: true, required: true });
    this.addStringField('Brand', 'Merkki', { length: 80, required: true });
    this.addStringField('Model', 'Malli', { length: 80, required: true });
    this.addIntegerField('ModelYear', 'Vuosimalli', { align: TextAlign.RIGHT, required: true });
    this.addIntegerField('Fuel', 'Käyttövoima', { displayTexts: fuels, required: true });
    this.addIntegerField('EngineDisplacement', 'Iskutilavuus', { align: TextAlign.RIGHT });
    this.addStringField('EngineCode', 'Moottorin koodi', { length: 10, code: true });
    this.addStringField('VIN', 'VIN', { length: 20, code: true });
    this.addStringField('MID', 'MID', { length: 10, code: true });
  }

  getListCaption() {
    return 'Autot';
  }

  getAddCaption() {
    return 'Lisää auto';
  }

  getEditCaption() {
    return 'Muokkaa autoa';
  }

  getDeleteCaption() {
    return 'Poista auto';
  }
}


export class BulletinGroupTable extends BaseTable {
  constructor(database) {
    super(database, 'BulletinGroup', 10);

    this.addAutoIncrementField('Id', 'No');
    this.addStringField('Name', 'Nimi', { length: 80, required: true });
    this.addStatusFields();
  }

  getListCaption() {
    return 'Tiedoteryhmät';
  }

  getAddCaption() {
    return 'Lisää tiedoteryhmä';
  }

  getEditCaption() {
    return 'Muokkaa tiedoteryhmää';
  }

  getDeleteCaption() {
    return 'Poista tiedoteryhmä';
  }
}


export class ProblemTable extends BaseTable {
  constructor(database) {
    super(database, 'Problem', 10);

    this.addAutoIncrementField('Id', 'No');
    this.addDateField('Date', 'Pvm', { readonly: true, required: true });
    this.addIntegerField('ClientId', 'Lähettäjä', { lookupSQL: "SELECT Id, CONCAT(FirstName, ' ', LastName) AS Text FROM Client", foreignKey: true, readonly: true, required: true });
    this.addIntegerField('Type', 'Tyyppi', { displayTexts: ['Vikatapaus', 'Tiedote'], required: true });
    this.addStringField('LicenseNumber', 'Rekistenumero', { length: 7, code: true });
    this.addStringField('Brand', 'Merkki', { length: 40 });
    this.addStringField('Model', 'Malli', { length: 40 });
    this.addIntegerField('ModelYear', 'Vuosimalli', { align: TextAlign.RIGHT });
    this.addIntegerField('Fuel', 'Käyttövoima', { displayTexts: fuels });
    this.addStringField('Title', 'Viesti', { length: 40 });
    this.addIntegerField('Status', 'Tila', { displayTexts: ['Avoin', 'Ratkaistu', 'Ratkaisematon'], readonly: true });
  }

  getListCaption() {
    return 'Vikatapaukset';
  }

  getAddCaption() {
    return 'Lisää vikatapaus';
  }

  getEditCaption() {
    return 'Muokkaa vikatapausta';
  }

  getDeleteCaption() {
    return 'Poista vikatapaus';
  }
}


export class NoticeTable extends BaseTable {
  constructor(database) {
    super(database, 'Notice', 10);

    this.addAutoIncrementField('Id', 'No');
    this.addDateField('Date', 'Pvm', { readonly: true, required: true });
    this.addIntegerField('ClientId', 'Lähettäjä', { lookupSQL: "SELECT Id, CONCAT(FirstName, ' ', LastName) AS Text FROM Client", foreignKey: true, readonly: true, required: true });
    this.addStringField('Title', 'Otsikko', { length: 80, required: true });
    this.addStringField('Message', 'Viesti', { cols: 80, rows: 10, required: true });
  }

  getListCaption() {
    return 'Ilmoitukset';
  }

  getAddCaption() {
    return 'Lisää ilmoitus';
  }

  getEditCaption() {
    return 'Muokkaa ilmoitusta';
  }

  getDeleteCaption() {
    return 'Poista ilmoitus';
  }
}
