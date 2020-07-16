import BaseForm from '../BaseForm';

export default class BrandForm extends BaseForm {
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
    
    this.state.data = this.getEmptyData();
  }

  getTitle() {
    return 'Automerkki';
  }

  getApiName() {
    return 'brands';
  }
}
