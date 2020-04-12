import { RestDatabase } from '@/lib/dataset';
import { TextAlign } from '@/lib/dataset';
import { BaseTable } from './base';


export interface ProblemFilter {
  type?: number | string;
  status?: number;
}


export class ProblemTable extends BaseTable {
  constructor(database: RestDatabase, filter: ProblemFilter = {}) {
    super(database, 'Problem');

    let sql =
      'SELECT Problem.Id, Problem.Date, CONCAT(User.FirstName, " ", User.LastName) AS UserName, ' +
      'Problem.Type, Problem.LicenseNumber, Problem.Brand, Problem.Model, Problem.ModelYear, Problem.Fuel, Problem.Title, Problem.Description, Problem.Status ' +
      'FROM Problem, User ' +
      'WHERE Problem.UserId = User.Id';

    if (filter.type)
      sql += ' AND Problem.Type = ' + filter.type;

    if (filter.status)
      sql += ' AND Problem.Status = ' + filter.status;

    sql += ' ORDER BY Problem.Id';

    this.SQL = sql;

    this.addAutoIncrementField({ name: 'Id', caption: 'No' });
    this.addDateField({ name: 'Date', caption: 'Pvm', readonly: true, required: true });
    this.addIntegerField({ name: 'UserId', caption: 'Lähettäjä', lookupSQL: "SELECT Id, CONCAT(FirstName, ' ', LastName) AS Text FROM User", hideInGrid: true, foreignKey: true, readonly: true, required: true });
    this.addStringField({ name: 'UserName', caption: 'Lähettäjä', hideInDialog: true });
    this.addIntegerField({ name: 'Type', caption: 'Tyyppi', displayTexts: ['Vikatapaus', 'Tiedote'], readonly: true, required: true });
    this.addStringField({ name: 'LicenseNumber', caption: 'Rekistenumero', length: 7, code: true });
    this.addStringField({ name: 'Brand', caption: 'Merkki', length: 40 });
    this.addStringField({ name: 'Model', caption: 'Malli', length: 40 });
    this.addIntegerField({ name: 'ModelYear', caption: 'Vuosimalli', align: TextAlign.Right });
    this.addIntegerField({ name: 'Fuel', caption: 'Käyttövoima', displayTexts: ProblemTable.FUELS });
    this.addStringField({ name: 'Title', caption: 'Otsikko', length: 80, required: true });
    this.addStringField({ name: 'Description', caption: 'Kuvaus', cols: 80, rows: 10, required: true });
    this.addIntegerField({ name: 'Status', caption: 'Tila', displayTexts: ['avoin', 'ratkaistu', 'ratkaisematon'], readonly: true, onCellColor: this.statusCellColor });
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
