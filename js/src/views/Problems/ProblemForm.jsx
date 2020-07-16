import BaseForm from '../BaseForm';
import { FUEL_TYPES, STATUSES } from './ProblemsTable';

export default class ProblemForm extends BaseForm {
  state = {
    data: {},
    errors: {}
  }

  constructor() {
    super();

    this.addId();
    this.addField('Date',               'Pvm',                'datetime', { required: true, readonly: true });
    this.addField('UserId',             'Lähettäjä',          'number',   { required: true, readonly: true, lookupUrl: 'Users' });
    this.addField('Make',               'Merkki',             'text',     { required: true });
    this.addField('Model',              'Malli',              'text');
    this.addField('ModelYear',          'Vuosimalli',         'number');
    this.addField('ModelBeginYear',     'Vuodesta',           'number');
    this.addField('ModelEndYear',       'Vuoteen',            'number');
    this.addField('RegistrationYear',   'Rekisteröintivuosi', 'number');
    this.addField('RegistrationNumber', 'Rekisterinumero',    'text');
    this.addField('FuelType',           'Käyttövoima',        'number',   { enums: FUEL_TYPES });
    this.addField('Power',              'Teho (kW)',          'number');
    this.addField('CylinderCount',      'Sylinterimäärä',     'number');
    this.addField('EngineSize',         'Sylinteritilavuus',  'number');
    this.addField('EngineCode',         'Moottorin koodi',    'text');
    this.addField('VIN',                'VIN',                'text');
    this.addField('NetWeight',          'Omamassa (kg)',      'number');
    this.addField('GrossWeight',        'Kokonaismassa (kg)', 'number');
    this.addField('Title',              'Otsikko',            'text',     { required: true });
    this.addField('Description',        'Kuvaus',             'textarea', { required: true, rows: 10 });
    this.addField('Status',             'Tila',               'number',   { required: true, getDefaultValue: () => 0, enums: STATUSES });

    this.state.data = this.getEmptyData();
  }

  getTitle() {
    return 'Vikatapaus';
  }

  getApiName() {
    return 'problems';
  }
}
