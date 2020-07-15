import DataForm from '../DataForm';
import { FUELS, STATUSES } from './ProblemsTable';

export default class ProblemForm extends DataForm {
  state = {
    data: {},
    errors: {}
  }

  constructor() {
    super();

    this.addId();
    this.addField('Date',             'Pvm',                'datetime', { required: true, readonly: true });
    this.addField('UserId',           'Lähettäjä',          'number',   { required: true, readonly: true, lookupUrl: 'Users' });
    this.addField('Brand',            'Merkki',             'text',     { required: true });
    this.addField('Model',            'Malli',              'text');
    this.addField('ModelYear',        'Vuosimalli',         'number');
    this.addField('ModelBeginYear',   'Vuodesta',           'number');
    this.addField('ModelEndYear',     'Vuoteen',            'number');
    this.addField('RegistrationYear', 'Rekisteröintivuosi', 'number');
    this.addField('Fuel',             'Käyttövoima',        'number',   { enums: FUELS });
    this.addField('Title',            'Otsikko',            'text',     { required: true });
    this.addField('Description',      'Kuvaus',             'textarea', { required: true });
    this.addField('Status',           'Tila',               'number',   { required: true, getDefaultValue: () => 0, enums: STATUSES });

    this.state.data = this.emptyData();
  }

  get title() {
    return 'Vikatapsus';
  }

  get api() {
    return 'problems';
  }
}
