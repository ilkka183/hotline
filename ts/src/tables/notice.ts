import { BaseTable } from './base';
import { RestDatabase } from '@/lib/dataset';


export class NoticeTable extends BaseTable {
  constructor(database: RestDatabase) {
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

  public getListCaption(): string {
    return 'Ilmoitukset';
  }

  public getAddCaption(): string {
    return 'Lisää ilmoitus';
  }

  public getEditCaption(): string {
    return 'Muokkaa ilmoitusta';
  }

  public getDeleteCaption(): string {
    return 'Poista ilmoitus';
  }
}
