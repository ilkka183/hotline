import { BaseTable } from './base';
import { RestDatabase } from '@/lib/dataset';


export class ClientGroupTable extends BaseTable {
  constructor(database: RestDatabase) {
    super(database, 'ClientGroup');

    this.sql = 'SELECT Id, Name,';
    this.sql += ' Address, PostalCode, PostOffice, Country, Phone, Email, Website,';
    this.sql += ' Logo, Info, Enabled';
    this.sql += ' FROM ClientGroup';
    this.sql += ' ORDER BY Id';

    this.addAutoIncrementField('Id', 'No');
    this.addStringField('Name', 'Nimi', { length: 40, required: true });
    this.addAddressFields();
    this.addImageField('Logo', 'Logo');
    this.addInfoField();
    this.addStatusFields();
  }

  public getListCaption(): string {
    return 'Käyttäjäryhmät';
  }

  public getAddCaption(): string {
    return 'Lisää käyttäjäryhmä';
  }

  public getEditCaption(): string {
    return 'Muokkaa käyttäjäryhmää';
  }

  public getDeleteCaption(): string {
    return 'Poista käyttäjäryhmä';
  }
}


export class ClientTable extends BaseTable {
  constructor(database: RestDatabase) {
    super(database, 'Client');

    this.sql = 'SELECT Client.Id, Client.GroupId, ClientGroup.Name AS GroupName, Client.ClientType, Client.FirstName, Client.LastName, Client.Title,';
    this.sql += ' Client.Address, Client.PostalCode, Client.PostOffice, Client.Country, Client.Phone, Client.Email, Client.Website,';
    this.sql += ' Client.Info, Client.LicenseBegin, Client.LicenseEnd, Client.Enabled';
    this.sql += ' FROM Client, ClientGroup';
    this.sql += ' WHERE Client.GroupId = ClientGroup.Id';
    this.sql += ' ORDER BY Client.Id';

    this.addAutoIncrementField('Id', 'No');
    this.addIntegerField('GroupId', 'Käyttäjäryhmä', { lookupSQL: "SELECT Id, Name AS Text FROM ClientGroup", hideInGrid: true, foreignKey: true, required: true });
    this.addStringField('GroupName', 'Käyttäjäryhmä', { hideInDialog: true });
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

  public getListCaption(): string {
    return 'Käyttäjät';
  }

  public getAddCaption(): string {
    return 'Lisää käyttäjä';
  }

  public getEditCaption(): string {
    return 'Muokkaa käyttäjää';
  }

  public getDeleteCaption(): string {
    return 'Poista käyttäjä';
  }
}
