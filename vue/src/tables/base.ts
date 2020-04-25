import { RestDatabase } from '@/lib/dataset';
import { SqlTable } from '@/lib/sql-dataset';


export abstract class BaseTable extends SqlTable {
  public static FUELS = [
    'bensiini',
    'diesel',
    'kaasu',
    'sähkö'
  ];

  constructor(database: RestDatabase, name: string, customApi: string, filter: object = null) {
    super(database, name, customApi, filter);
  }
  
  protected addAddressFields(emailRequired: boolean) {
    this.addStringField({ name: 'Address', caption: 'Lähiosoite', length: 80 });
    this.addStringField({ name: 'PostalCode', caption: 'Postinumero', length: 10 });
    this.addStringField({ name: 'PostOffice', caption: 'Postitoimipaikka', length: 40 });
    this.addStringField({ name: 'Country', caption: 'Maa', length: 40 });
    this.addStringField({ name: 'Phone', caption: 'Puhelin', length: 20 });
    this.addStringField({ name: 'Email', caption: 'Sähköposti', length: 80, code: true, required: emailRequired });
    this.addStringField({ name: 'Website', caption: 'Kotisivut', hideInGrid: true, length: 80, code: true });
  }

  protected addInfoField() {
    this.addTextField({ name: 'Info', caption: 'Lisätietoja' });
  }

  protected addStatusFields() {
    this.addBooleanField({ name: 'Enabled', caption: 'Voimassa', default: true, required: true });
    this.addDateTimeField({ name: 'CreatedAt', caption: 'Luotu', hideInGrid: true, readonly: true, required: true });
    this.addDateTimeField({ name: 'UpdatedAt', caption: 'Päivitetty', hideInGrid: true, readonly: true });
  }
}
