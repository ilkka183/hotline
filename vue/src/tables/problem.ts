import { RestDatabase } from '@/lib/dataset';
import { BaseTable } from './base';
import { User, UserRole } from '../js/user'


export enum ProblemStatus {
  Open = 0,
  Resolved,
  Unresolved
}


export interface ProblemFilter {
  status?: number;
}


export class ProblemTable extends BaseTable {
  public static readonly fuelTexts: string[] = [
    'bensiini',
    'diesel',
    'kaasu',
    'sähkö'
  ];

  public static readonly statusTexts: string[] = [
    'avoin',
    'ratkaistu',
    'ratkaisematon'];

  private readonly user: User;
  
  constructor(database: RestDatabase, user: User, filter: ProblemFilter = {}) {
    super(database, 'Problem', 'Problems', filter);

    this.user = user;

    this.addAutoIncrementField({ name: 'Id', caption: 'No' });
    this.addDateField({ name: 'Date', caption: 'Pvm', readonly: true, required: true });
    this.addIntegerField({ name: 'UserId', caption: 'Lähettäjä', lookupApi: 'Users', hideInGrid: true, foreignKey: true, readonly: true, required: true });
    this.addStringField({ name: 'UserName', caption: 'Lähettäjä', hideInGrid: user ? user.hideSender : true, hideInDialog: true });
    this.addStringField({ name: 'LicenseNumber', caption: 'Rekistenumero', length: 7, code: true, hideInGrid: true, hideInDialog: user ? user.hideSender : true });
    this.addStringField({ name: 'Brand', caption: 'Merkki', length: 40, required: true });
    this.addStringField({ name: 'Model', caption: 'Malli', length: 40 });
    this.addIntegerField({ name: 'YearMin', caption: 'Alkuvuosi', hideInGrid: true });
    this.addIntegerField({ name: 'YearMax', caption: 'Loppuvuosi', hideInGrid: true });
    this.addIntegerField({ name: 'Years', caption: 'Vuosimallit', onCellText: (row: any) => row.YearMin + '-' + row.YearMax });
    this.addIntegerField({ name: 'Fuel', caption: 'Käyttövoima', enumTexts: ProblemTable.fuelTexts });
    this.addStringField({ name: 'Title', caption: 'Otsikko', length: 80, required: true });
    this.addTextField({ name: 'Description', caption: 'Kuvaus', required: true });

    this.addIntegerField({
      name: 'Status',
      caption: 'Tila',
      enumTexts: ProblemTable.statusTexts,
      readonly: true,
      onCellColor: this.statusCellColor });
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

  protected getOpenCaption(): string {
    return 'Vikatapaus';
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

  protected getAddPath(): string {
    return 'new-problem';
  }

  protected getOpenPath(): string {
    return 'open-problem';
  }
}


export class ProblemReplyTable extends BaseTable {
  private user: User;
  
  constructor(database: RestDatabase, user: User, problemId: number) {
    super(database, 'ProblemReply', 'ProblemReplies');

    this.user = user;

    this.fixedValues = { ProblemId: problemId };
    console.log(this.fixedValues);
    console.log('user', user);

    this.addAutoIncrementField({ name: 'Id', caption: 'Vastaus No', hideInGrid: true });
    this.addIntegerField({ name: 'ProblemId', caption: 'Vikatapaus No', primaryKey: true, hideInGrid: true, readonly: true });
    this.addDateField({ name: 'Date', caption: 'Pvm', readonly: true, required: true });

    this.addIntegerField({
      name: 'UserId',
      caption: 'Lähettäjä',
      lookupApi: 'Users',
      foreignKey: true,
      readonly: true,
      required: true,
      hideInGrid: true,
      hideInDialog: user ? user.hideSender : true
    });

    this.addStringField({
      name: 'UserName',
      caption: 'Lähettäjä',
      hideInDialog: true,
      onCellText: (row) => user && (user.showSender || user.id == row.UserId) ? row.UserName : 'käyttäjä'
    });

    this.addTextField({ name: 'Message', caption: 'Viesti', required: true });
  }

  protected initialize(row: object) {
    super.initialize(row);

    row['UserId'] = this.user.id;
  }

  protected getListCaption(): string {
    return 'Vastaukset';
  }

  protected getOpenCaption(): string {
    return 'Vastaus';
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
