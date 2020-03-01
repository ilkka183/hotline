import { RestDatabase } from '@/lib/dataset';
import { TextAlign } from '@/lib/dataset';
import { BaseTable } from './base';


export class VehicleTable extends BaseTable {
  constructor(database: RestDatabase) {
    super(database, 'Vehicle');

    this.SQL = 'SELECT LicenseNumber, Brand, Model, ModelYear, Fuel, EngineDisplacement, EngineCode, VIN, MID FROM Vehicle ORDER BY LicenseNumber';

    this.addStringField({ name: 'LicenseNumber', caption: 'Rekisterinumero', length: 7, primaryKey: true, code: true, required: true });
    this.addStringField({ name: 'Brand', caption: 'Merkki', length: 80, required: true });
    this.addStringField({ name: 'Model', caption: 'Malli', length: 80, required: true });
    this.addIntegerField({ name: 'ModelYear', caption: 'Vuosimalli', align: TextAlign.Right, required: true });
    this.addIntegerField({ name: 'Fuel', caption: 'Käyttövoima', displayTexts: VehicleTable.FUELS, required: true });
    this.addIntegerField({ name: 'EngineDisplacement', caption: 'Iskutilavuus', align: TextAlign.Right });
    this.addStringField({ name: 'EngineCode', caption: 'Moottorin koodi', length: 10, code: true });
    this.addStringField({ name: 'VIN', caption: 'VIN', length: 20, code: true });
    this.addStringField({ name: 'MID', caption: 'MID', length: 10, code: true });
  }

  protected getListCaption(): string {
    return 'Autot';
  }

  protected getAddCaption(): string {
    return 'Lisää auto';
  }

  protected getEditCaption(): string {
    return 'Muokkaa autoa';
  }

  protected getDeleteCaption(): string {
    return 'Poista auto';
  }
}
