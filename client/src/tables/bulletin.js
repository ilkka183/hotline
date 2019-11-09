import { BaseTable } from './base';


export class BulletinGroupTable extends BaseTable {
  constructor(database) {
    super(database, 'BulletinGroup');

    this.sql = 'SELECT Id, Name, Enabled FROM BulletinGroup ORDER BY Id';

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
