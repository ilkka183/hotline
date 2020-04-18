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
    super(database, 'Problem');

    this.user = user;

    let sql =
      'SELECT Problem.Id, Problem.Date, CONCAT(User.FirstName, " ", User.LastName) AS UserName, ' +
      'Problem.LicenseNumber, Problem.Brand, Problem.Model, Problem.ModelYear, Problem.Fuel, Problem.Title, Problem.Description, Problem.Status ' +
      'FROM Problem, User ' +
      'WHERE Problem.UserId = User.Id';

    if (filter.status)
      sql += ' AND Problem.Status = ' + filter.status;

    sql += ' ORDER BY Problem.Id';

    this.SQL = sql;

    this.addAutoIncrementField({ name: 'Id', caption: 'No' });
    this.addDateField({ name: 'Date', caption: 'Pvm', readonly: true, required: true });
    this.addIntegerField({ name: 'UserId', caption: 'Lähettäjä', lookupSQL: "SELECT Id, CONCAT(FirstName, ' ', LastName) AS Text FROM User", hideInGrid: true, foreignKey: true, readonly: true, required: true });
    this.addStringField({ name: 'UserName', caption: 'Lähettäjä', hideInDialog: true });
    this.addStringField({ name: 'LicenseNumber', caption: 'Rekistenumero', length: 7, code: true });
    this.addStringField({ name: 'Brand', caption: 'Merkki', length: 40, required: true });
    this.addStringField({ name: 'Model', caption: 'Malli', length: 40 });
    this.addIntegerField({ name: 'ModelYear', caption: 'Vuosimalli', align: TextAlign.Right });
    this.addIntegerField({ name: 'Fuel', caption: 'Käyttövoima', displayTexts: ProblemTable.FUELS });
    this.addStringField({ name: 'Title', caption: 'Otsikko', length: 80, required: true });
    this.addTextField({ name: 'Description', caption: 'Kuvaus', required: true });
    this.addIntegerField({ name: 'Status', caption: 'Tila', displayTexts: ['avoin', 'ratkaistu', 'ratkaisematon'], readonly: true, onCellColor: this.statusCellColor });
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
  private readonly user: User;
  private readonly problemId: any;
  
  constructor(database: RestDatabase, user: User, problemId: any) {
    super(database, 'ProblemReply');

    this.user = user;
    this.problemId = problemId;

    let sql =
      'SELECT ProblemReply.ProblemId, ProblemReply.Id, ProblemReply.Date, CONCAT(User.FirstName, " ", User.LastName) AS UserName, ProblemReply.Message ' +
      'FROM ProblemReply, User ' +
      'WHERE ProblemReply.UserId = User.Id AND ProblemReply.ProblemId = ' + problemId;

    sql += ' ORDER BY ProblemReply.ProblemId, ProblemReply.Id';

    this.SQL = sql;

    this.addIntegerField({ name: 'ProblemId', caption: 'Vikatapaus No', primaryKey: true, hideInGrid: true });
    this.addIntegerField({ name: 'Id', caption: 'Vastaus No', primaryKey: true, hideInGrid: true });
    this.addDateField({ name: 'Date', caption: 'Pvm', readonly: true, required: true });
    this.addIntegerField({ name: 'UserId', caption: 'Lähettäjä', lookupSQL: "SELECT Id, CONCAT(FirstName, ' ', LastName) AS Text FROM User", hideInGrid: true, foreignKey: true, readonly: true, required: true });
    this.addStringField({ name: 'UserName', caption: 'Lähettäjä', hideInDialog: true });
    this.addTextField({ name: 'Message', caption: 'Viesti', required: true });
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

  protected getDeleteCaption(): string {
    return 'Poista vastaus';
  }
}
