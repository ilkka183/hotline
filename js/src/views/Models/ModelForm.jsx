import BaseForm from '../BaseForm';
import { FUEL_TYPES } from '../Problems/ProblemsTable';

export default class ModelForm extends BaseForm {
  state = {
    data: {},
    errors: {}
  }

  constructor() {
    super();

    this.addId();
    this.addField('MakeId',        'Merkki',               'number', { required: true, lookupUrl: 'Makes' });
    this.addField('Name',          'Malli',                'text',   { required: true });
    this.addField('BeginYear',     'Vuodesta',             'number', { required: true });
    this.addField('EndYear',       'Vuoteen',              'number');
    this.addField('FuelType',      'Käyttövoima',          'number', { required: true, enums: FUEL_TYPES });
    this.addField('EngineSize',    'Kuutiotilavuus (cm3)', 'number', { required: true });
    this.addField('CylinderCount', 'Sylinterimäärä',       'number', { required: true });
    this.addField('EnginePower',   'Teho (kW)',            'number', { required: true });
    this.addField('EngineCode',    'Moottorin koodi',      'text');
    this.addField('MID',           'MID',                  'text');
    this.addEnabled();
    this.addTimestamps();
    
    this.state.data = this.getEmptyData();
  }

  getTitle() {
    return 'Automallit';
  }

  getApiName() {
    return 'models';
  }
}
