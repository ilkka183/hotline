import { BaseTable } from './base';


export class NoticeTable extends BaseTable {
  constructor(database) {
    super(database, 'Notice');

    this.sql = 'SELECT * FROM Notice ORDER BY Id';

    this.addAutoIncrementField('Id', 'No');
    this.addDateField('Date', 'Pvm', { readonly: true, required: true });
    this.addIntegerField('ClientId', 'Lähettäjä', { lookupSQL: "SELECT Id, CONCAT(FirstName, ' ', LastName) AS Text FROM Client", foreignKey: true, readonly: true, required: true });
    this.addStringField('Title', 'Otsikko', { length: 80, required: true });
    this.addStringField('Message', 'Viesti', { cols: 80, rows: 10, required: true });
  }

  getListCaption() {
    return 'Ilmoitukset';
  }

  getAddCaption() {
    return 'Lisää ilmoitus';
  }

  getEditCaption() {
    return 'Muokkaa ilmoitusta';
  }

  getDeleteCaption() {
    return 'Poista ilmoitus';
  }
}
