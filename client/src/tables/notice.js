import { BaseTable } from './base';


export class NoticeTable extends BaseTable {
  constructor(database) {
    super(database, 'Notice');

    this.sql = 'SELECT Notice.Id, Notice.Date, CONCAT(Client.FirstName, " ", Client.LastName) AS ClientName, Notice.Title, Notice.Message';
    this.sql += ' FROM Notice, Client';
    this.sql += ' WHERE Notice.ClientId = Client.Id';
    this.sql += ' ORDER BY Notice.Id';

    this.addAutoIncrementField('Id', 'No');
    this.addDateField('Date', 'Pvm', { readonly: true, required: true });
    this.addIntegerField('ClientId', 'Lähettäjä', { lookupSQL: "SELECT Id, CONCAT(FirstName, ' ', LastName) AS Text FROM Client", hideInGrid: true, foreignKey: true, readonly: true, required: true });
    this.addStringField('ClientName', 'Lähettäjä', { hideInDialog: true });
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
