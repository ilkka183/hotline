import DataForm from '../DataForm';

export default class BrandForm extends DataForm {
  state = {
    data: {},
    errors: {}
  }

  constructor() {
    super();

    this.addId();
    this.addField('Name', 'Nimi', 'text',     { required: true });
    this.addField('Info', 'Info', 'textarea', { rows: 5 });
    this.addEnabled();
    this.addTimestamps();
    
    this.state.data = this.emptyData();
  }

  get title() {
    return 'Automerkki';
  }

  get api() {
    return 'brands';
  }
}
