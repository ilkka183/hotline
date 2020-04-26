import { RestDatabase } from '@/lib/dataset';
import { TextAlign } from '@/lib/dataset';
import { BaseTable } from './base';
import { User } from '../js/user'


export interface ProblemFilter {
  status?: number;
}


export class ProblemTable extends BaseTable {
  private readonly user: User;
  
  constructor(database: RestDatabase, user: User, filter: ProblemFilter = {}) {
    super(database, 'Problem', 'Problems', filter);

    this.user = user;

    this.addAutoIncrementField({ name: 'Id', caption: 'No' });
    this.addDateField({ name: 'Date', caption: 'Pvm', readonly: true, required: true });
    this.addIntegerField({ name: 'UserId', caption: 'Lähettäjä', lookupApi: 'Users', hideInGrid: true, foreignKey: true, readonly: true, required: true });
    this.addStringField({ name: 'UserName', caption: 'Lähettäjä', hideInDialog: true });
    this.addStringField({ name: 'LicenseNumber', caption: 'Rekistenumero', length: 7, code: true });
    this.addStringField({ name: 'Brand', caption: 'Merkki', length: 40, required: true });
    this.addStringField({ name: 'Model', caption: 'Malli', length: 40 });
    this.addIntegerField({ name: 'ModelYear', caption: 'Vuosimalli', align: TextAlign.Right });
    this.addIntegerField({ name: 'Fuel', caption: 'Käyttövoima', enumTexts: ProblemTable.FUELS });
    this.addStringField({ name: 'Title', caption: 'Otsikko', length: 80, required: true });
    this.addTextField({ name: 'Description', caption: 'Kuvaus', required: true });
    this.addIntegerField({ name: 'Status', caption: 'Tila', enumTexts: ['avoin', 'ratkaistu', 'ratkaisematon'], readonly: true, onCellColor: this.statusCellColor });
  }

  protected initialize(row: object) {
    super.initialize(row);

    row['UserId'] = this.user.id;
  }

  protected getPageLimit(): number {
    return 10;
  }

  protected getListCaption(): string {
    return 'Vikatapaukset';
  }

  protected getAddCaption(): string {
    return 'Lisää vikatapaus';
  }

  protected getEditCaption(): string {
    return 'Muokkaa vikatapausta';
  }

  protected getOpenCaption(): string {
    return 'Vikatapaus';
  }

  protected getDeleteCaption(): string {
    return 'Poista vikatapaus';
  }

  private statusCellColor(row: object): string | null {
    switch (row[this.tableName]) {
      case 0: return 'red';
      case 1: return 'green';
    }

    return null;
  }

  public navigateOpen(router: any, row: object) {
    const query = this.primaryKeys(row);
    router.push({ path: 'open-problem', query });
  }
}


export class ProblemReplyTable extends BaseTable {
  private user: User;
  
  constructor(database: RestDatabase, user: User, problemId: number) {
    super(database, 'ProblemReply', 'ProblemReplies');

    this.user = user;

    this.fixedValues = { ProblemId: problemId };
    console.log(this.fixedValues);

    this.addAutoIncrementField({ name: 'Id', caption: 'Vastaus No', hideInGrid: true });
    this.addIntegerField({ name: 'ProblemId', caption: 'Vikatapaus No', primaryKey: true, hideInGrid: true, readonly: true });
    this.addDateField({ name: 'Date', caption: 'Pvm', readonly: true, required: true });
    this.addIntegerField({ name: 'UserId', caption: 'Lähettäjä', lookupApi: 'Users', hideInGrid: true, foreignKey: true, readonly: true, required: true });
    this.addStringField({ name: 'UserName', caption: 'Lähettäjä', hideInDialog: true });
    this.addTextField({ name: 'Message', caption: 'Viesti', required: true });
  }

  protected initialize(row: object) {
    super.initialize(row);

    row['UserId'] = this.user.id;
  }

  protected getListCaption(): string {
    return 'Vastaukset';
  }

  protected getAddCaption(): string {
    return 'Lisää vastaus';
  }

  protected getEditCaption(): string {
    return 'Muokkaa vastausta';
  }

  protected getOpenCaption(): string {
    return 'Vastaus';
  }

  protected getDeleteCaption(): string {
    return 'Poista vastaus';
  }
}
