import { TextAlign } from '../lib/dataset';
import { BaseTable, fuels } from './base';


export class VehicleTable extends BaseTable {
  constructor(database) {
    super(database, 'Vehicle');

    this.sql = 'SELECT LicenseNumber, Brand, Model, ModelYear, Fuel, EngineDisplacement, EngineCode, VIN, MID ';
    this.sql += 'FROM Vehicle ORDER BY LicenseNumber';

    this.addStringField('LicenseNumber', 'Rekisterinumero', { length: 7, primaryKey: true, code: true, required: true });
    this.addStringField('Brand', 'Merkki', { length: 80, required: true });
    this.addStringField('Model', 'Malli', { length: 80, required: true });
    this.addIntegerField('ModelYear', 'Vuosimalli', { align: TextAlign.RIGHT, required: true });
    this.addIntegerField('Fuel', 'Käyttövoima', { displayTexts: fuels, required: true });
    this.addIntegerField('EngineDisplacement', 'Iskutilavuus', { align: TextAlign.RIGHT });
    this.addStringField('EngineCode', 'Moottorin koodi', { length: 10, code: true });
    this.addStringField('VIN', 'VIN', { length: 20, code: true });
    this.addStringField('MID', 'MID', { length: 10, code: true });
  }

  getListCaption() {
    return 'Autot';
  }

  getAddCaption() {
    return 'Lisää auto';
  }

  getEditCaption() {
    return 'Muokkaa autoa';
  }

  getDeleteCaption() {
    return 'Poista auto';
  }
}
