import { RestDatabase } from '@/lib/dataset';
import { BaseTable } from './base';
import { User } from '../js/user';


export class UserGroupTable extends BaseTable {
  constructor(database: RestDatabase) {
    super(database, 'UserGroup');
    this.custom = 'UserGroups';

    this.addAutoIncrementField({ name: 'Id', caption: 'No' });
    this.addStringField({ name: 'Name', caption: 'Nimi', length: 40, required: true });
    this.addAddressFields(false);
    this.addImageField({ name: 'Logo', caption: 'Logo' });
    this.addInfoField();
    this.addStatusFields();
  }

  protected getListCaption(): string {
    return 'Käyttäjäryhmät';
  }

  protected getAddCaption(): string {
    return 'Lisää käyttäjäryhmä';
  }

  protected getEditCaption(): string {
    return 'Muokkaa käyttäjäryhmää';
  }

  protected getDeleteCaption(): string {
    return 'Poista käyttäjäryhmä';
  }
}


export class UserTable extends BaseTable {
  constructor(database: RestDatabase) {
    super(database, 'User');
    this.custom = 'Users';

    this.addAutoIncrementField({ name: 'Id', caption: 'No' });
    this.addIntegerField({ name: 'GroupId', caption: 'Käyttäjäryhmä', lookupSQL: "SELECT Id, Name AS Text FROM UserGroup", hideInGrid: true, foreignKey: true, required: true });
    this.addStringField({ name: 'GroupName', caption: 'Käyttäjäryhmä', hideInDialog: true });
    this.addIntegerField({ name: 'Role', caption: 'Rooli', displayTexts: User.typeTexts, required: true });
    this.addStringField({ name: 'Username', caption: 'Käyttäjätunnus', length: 20, hideInGrid: true, required: true });
    this.addStringField({ name: 'Password', caption: 'Salasana', length: 20, hideInGrid: true, required: true });
    this.addStringField({ name: 'FirstName', caption: 'Etunimi', length: 20, required: true });
    this.addStringField({ name: 'LastName', caption: 'Sukunimi', length: 20, required: true });
    this.addStringField({ name: 'Title', caption: 'Toimenkuva', length: 20 });
    this.addAddressFields(true);
    this.addInfoField();
    this.addDateField({ name: 'LicenseBegin', caption: 'Alku' });
    this.addDateField({ name: 'LicenseEnd', caption: 'Loppu' });
    this.addStatusFields();
  }

  protected getListCaption(): string {
    return 'Käyttäjät';
  }

  protected getAddCaption(): string {
    return 'Lisää käyttäjä';
  }

  protected getEditCaption(): string {
    return 'Muokkaa käyttäjää';
  }

  protected getDeleteCaption(): string {
    return 'Poista käyttäjä';
  }
}
