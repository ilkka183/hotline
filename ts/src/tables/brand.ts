import { BaseTable } from './base';
import { RestDatabase } from '@/lib/dataset';


export class BrandTable extends BaseTable {
  constructor(database: RestDatabase) {
    super(database, 'Brand');

    this.sql = 'SELECT Id, Name, Logo, Info, Enabled FROM Brand ORDER BY Id';

    this.addAutoIncrementField('Id', 'No');
    this.addStringField('Name', 'Nimi', { length: 80, required: true });
    this.addImageField('Logo', 'Logo', { readonly: true });
    this.addInfoField();
    this.addStatusFields();
  }

  public getListCaption(): string {
    return 'Automerkit';
  }

  public getAddCaption(): string {
    return 'Lisää automerkki';
  }

  public getEditCaption(): string {
    return 'Muokkaa automerkkiä';
  }

  public getDeleteCaption(): string {
    return 'Poista automerkki';
  }
}
