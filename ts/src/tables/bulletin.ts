import { BaseTable } from './base';
import { RestDatabase } from '@/lib/dataset';


export class BulletinGroupTable extends BaseTable {
  constructor(database: RestDatabase) {
    super(database, 'BulletinGroup');

    this.sql = 'SELECT Id, Name, Enabled FROM BulletinGroup ORDER BY Id';

    this.addAutoIncrementField('Id', 'No');
    this.addStringField('Name', 'Nimi', { length: 80, required: true });
    this.addStatusFields();
  }

  public getListCaption(): string {
    return 'Tiedoteryhmät';
  }

  public getAddCaption(): string {
    return 'Lisää tiedoteryhmä';
  }

  public getEditCaption(): string {
    return 'Muokkaa tiedoteryhmää';
  }

  public getDeleteCaption(): string {
    return 'Poista tiedoteryhmä';
  }
}
