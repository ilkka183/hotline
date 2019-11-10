import { TextAlign } from '../lib/dataset';
import { BaseTable, fuels } from './base';


export class ProblemTable extends BaseTable {
  constructor(database, filters) {
    super(database, 'Problem');

    this.sql = 'SELECT Problem.Id, Problem.Date, CONCAT(Client.FirstName, " ", Client.LastName) AS ClientName,';
    this.sql += ' Problem.Type, Problem.LicenseNumber, Problem.Brand, Problem.Model, Problem.ModelYear, Problem.Fuel, Problem.Title, Problem.Status';
    this.sql += ' FROM Problem, Client';
    this.sql += ' WHERE Problem.ClientId = Client.Id';

    if (filters) {
      if (filters.type !== undefined)
        this.sql += ' AND Problem.Type = ' + filters.type;

      if (filters.status !== undefined)
        this.sql += ' AND Problem.Status = ' + filters.status;
    }

    this.sql += ' ORDER BY Problem.Id';

    this.addAutoIncrementField('Id', 'No');
    this.addDateField('Date', 'Pvm', { readonly: true, required: true });
    this.addIntegerField('ClientId', 'Lähettäjä', { lookupSQL: "SELECT Id, CONCAT(FirstName, ' ', LastName) AS Text FROM Client", hideInGrid: true, foreignKey: true, readonly: true, required: true });
    this.addStringField('ClientName', 'Lähettäjä', { hideInDialog: true });
    this.addIntegerField('Type', 'Tyyppi', { displayTexts: ['Vikatapaus', 'Tiedote'], required: true });
    this.addStringField('LicenseNumber', 'Rekistenumero', { length: 7, code: true });
    this.addStringField('Brand', 'Merkki', { length: 40 });
    this.addStringField('Model', 'Malli', { length: 40 });
    this.addIntegerField('ModelYear', 'Vuosimalli', { align: TextAlign.RIGHT });
    this.addIntegerField('Fuel', 'Käyttövoima', { displayTexts: fuels });
    this.addStringField('Title', 'Viesti', { length: 40 });
    this.addIntegerField('Status', 'Tila', { displayTexts: ['Avoin', 'Ratkaistu', 'Ratkaisematon'], readonly: true });
  }

  get pageLimit() {
    return 10;
  }

  getListCaption() {
    return 'Vikatapaukset';
  }

  getAddCaption() {
    return 'Lisää vikatapaus';
  }

  getEditCaption() {
    return 'Muokkaa vikatapausta';
  }

  getDeleteCaption() {
    return 'Poista vikatapaus';
  }
}
