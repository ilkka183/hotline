import { RestDatabase } from '@/lib/dataset';
import { BaseTable } from './base';


export class BrandTable extends BaseTable {
  constructor(database: RestDatabase) {
    super(database, 'Brand');

    this.SQL = 'SELECT Id, Name, Logo, Info, Enabled FROM Brand ORDER BY Id';

    this.addAutoIncrementField({ name: 'Id', caption: 'No' });
    this.addStringField({ name: 'Name', caption: 'Nimi', length: 80, required: true });
    this.addImageField({ name: 'Logo', caption: 'Logo', readonly: true });
    this.addInfoField();
    this.addStatusFields();
  }

  protected getListCaption(): string {
    return 'Automerkit';
  }

  protected getAddCaption(): string {
    return 'Lisää automerkki';
  }

  protected getEditCaption(): string {
    return 'Muokkaa automerkkiä';
  }

  protected getDeleteCaption(): string {
    return 'Poista automerkki';
  }
}
