import { RestDatabase } from '@/lib/dataset';
import { BaseTable } from './base';


export class BulletinGroupTable extends BaseTable {
  constructor(database: RestDatabase) {
    super(database, 'BulletinGroup');

    this.SQL = 'SELECT Id, Name, Enabled FROM BulletinGroup ORDER BY Id';

    this.addAutoIncrementField({ name: 'Id', caption: 'No' });
    this.addStringField({ name: 'Name', caption: 'Nimi', length: 80, required: true });
    this.addStatusFields();
  }

  protected getListCaption(): string {
    return 'Tiedoteryhmät';
  }

  protected getAddCaption(): string {
    return 'Lisää tiedoteryhmä';
  }

  protected getEditCaption(): string {
    return 'Muokkaa tiedoteryhmää';
  }

  protected getDeleteCaption(): string {
    return 'Poista tiedoteryhmä';
  }
}
