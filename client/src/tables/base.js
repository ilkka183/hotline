import { SqlTable } from '../lib/sql-dataset';


export const fuels = [
  'bensiini',
  'diesel',
  'kaasu',
  'sähkö'
];


export class BaseTable extends SqlTable {
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
