import { BaseTable } from './base';


export class BrandTable extends BaseTable {
  constructor(database) {
    super(database, 'Brand');

    this.sql = 'SELECT Id, Name, Logo, Info, Enabled FROM Brand ORDER BY Id';

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
