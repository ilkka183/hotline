import DataForm from '../DataForm';
import { FUELS } from './ProblemsTable';

export default class ProblemForm extends DataForm {
  state = {
    data: {},
    errors: {}
  }

  constructor() {
    super();
    
    this.addField('brand',       'Merkki',      'text',     { required: true });
    this.addField('model',       'Malli',       'text');
    this.addField('modelYear',   'Vuosimalli',  'number');
    this.addField('fuel',        'Käyttövoima', 'number',   { enums: FUELS });
    this.addField('title',       'Otsikko',     'text',     { required: true });
    this.addField('description', 'Kuvaus',      'textarea', { required: true, rows: 10 });

    this.state.data = this.emptyData();
  }

  get title() {
    return 'Vikatapaus';
  }

  get api() {
    return 'problems';
  }
}
