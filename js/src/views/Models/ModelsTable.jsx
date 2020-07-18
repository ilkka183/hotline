import BaseTable from '../BaseTable';
import { FUEL_TYPES } from '../Problems/ProblemsTable';

export default class ModelsTable extends BaseTable {
  constructor() {
    super();

    this.addId(false);
    this.addField('MakeName',      'Merkki',            'text');
    this.addField('Name',          'Malli',             'text',   { editLink: true});
    this.addField('BeginYear',     'Vuodesta',          'number');
    this.addField('EndYear',       'Vuoteen',           'number');
    this.addField('FuelType',      'Käyttövoima',       'number', { enums: FUEL_TYPES });
    this.addField('EngineSize',    'Sylinteritilavuus', 'number');
    this.addField('CylinderCount', 'Sylinterimäärä',    'number');
    this.addField('Power',         'Teho (kW)',         'number');
    this.addField('EngineCode',    'Moottorin koodi',   'text');
    this.addField('MID',           'MID',               'text');
    this.addEnabled();
  }

  getTitle() {
    return 'Automallit';
  }

  getApiName() {
    return 'models';
  }
}
