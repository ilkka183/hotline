import { RestDatabase } from '@/lib/dataset';
import { BaseTable } from './base';
import { User } from '../js/user'


export class NoticeTable extends BaseTable {
  private user: User;

  constructor(database: RestDatabase, user: User) {
    super(database, 'Notice', 'Notices');

    this.user = user;

    this.addAutoIncrementField({ name: 'Id', caption: 'No' });
    this.addDateField({ name: 'Date', caption: 'Pvm', readonly: true, required: true });
    this.addIntegerField({ name: 'UserId', caption: 'Lähettäjä', lookupApi: 'Users', hideInGrid: true, foreignKey: true, readonly: true, required: true });
    this.addStringField({ name: 'UserName', caption: 'Lähettäjä', hideInDialog: true });
    this.addStringField({ name: 'Title', caption: 'Otsikko', length: 80, required: true });
    this.addTextField({ name: 'Message', caption: 'Viesti', required: true });
  }

  protected initialize(row: object) {
    super.initialize(row);
    row['UserId'] = this.user.id;
  }

  protected getListCaption(): string {
    return 'Ilmoitukset';
  }

  protected getAddCaption(): string {
    return 'Lisää ilmoitus';
  }

  protected getEditCaption(): string {
    return 'Muokkaa ilmoitusta';
  }

  protected getDeleteCaption(): string {
    return 'Poista ilmoitus';
  }
}
