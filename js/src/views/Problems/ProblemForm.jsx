import DataForm from '../DataForm';
import { FormSchema } from '../../schemas/Schemas';
import { FUELS, STATUSES } from '../../schemas/ProblemsSchema';


class ProblemSchema extends FormSchema {
  constructor() {
    super('problems', 'Vikatapaukset');

    this.addId();
    this.addField('Date',             'Pvm',                'datetime', { required: true, readonly: true });
    this.addField('UserId',           'Lähettäjä',          'number',   { required: true, lookupUrl: 'Users' });
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
  }
}


export default class ProblemForm extends DataForm {
  schema = new ProblemSchema();

  state = {
    data: this.schema.emptyData(),
    errors: {}
  }
}
