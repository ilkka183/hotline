import { TextAlign } from '../lib/dataset';
import { BaseTable, fuels } from './base';


export class ProblemTable extends BaseTable {
  constructor(database) {
    super(database, 'Problem');

    this.sql = 'SELECT * FROM Problem ORDER BY Id';

    this.addAutoIncrementField('Id', 'No');
    this.addDateField('Date', 'Pvm', { readonly: true, required: true });
    this.addIntegerField('ClientId', 'Lähettäjä', { lookupSQL: "SELECT Id, CONCAT(FirstName, ' ', LastName) AS Text FROM Client", foreignKey: true, readonly: true, required: true });
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
    return 5;
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
