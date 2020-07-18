import DataForm from '../../DataForm';
import { FUEL_TYPES } from '../ProblemsTable';

export default class ProblemForm extends DataForm {
  state = {
    data: {},
    errors: {}
  }

  constructor() {
    super();
    
    this.addField('userId',             'Käyttäjä',           'number',   { required: true, readonly: true, visible: false });
    this.addField('make',               'Merkki',             'text',     { required: true });
    this.addField('model',              'Malli',              'text');
    this.addField('modelYear',          'Vuosimalli',         'number');
    this.addField('registrationYear',   'Rekisteröintivuosi', 'number');
    this.addField('registrationNumber', 'Rekisterinumero',    'text');
    this.addField('fuelType',           'Käyttövoima',        'number',   { enums: FUEL_TYPES });
    this.addField('cylinderCount',      'Sylinterimäärä',     'number');
    this.addField('enginePower',        'Teho (kW)',          'number');
    this.addField('engineSize',         'Kuutiotilavuus',     'number');
    this.addField('engineCode',         'Moottorin tunnus',   'text');
    this.addField('vin',                'VIN',                'text');
    this.addField('netWeight',          'Omamassa (kg)',      'number');
    this.addField('grossWeight',        'Kokonaismassa (kg)', 'number');
    this.addField('title',              'Otsikko',            'text',     { required: true });
    this.addField('description',        'Kuvaus',             'textarea', { required: true, rows: 10 });

    this.state.data = this.getEmptyData();
  }

  getTitle() {
    return 'Vikatapaus';
  }

  getApiName() {
    return 'problems';
  }

  afterSubmit() {
    this.props.onSubmit();
  }
}
