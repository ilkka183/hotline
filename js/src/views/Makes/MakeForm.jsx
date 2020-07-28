import BaseForm from '../BaseForm';

export default class MakeForm extends BaseForm {
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

  getApiName() {
    return 'makes';
  }

  getNewTitle() {
    return 'Uusi automerkki';
  }

  getEditTitle() {
    return 'Muokkaa automerkkiä';
  }

  getDeleteTitle() {
    return 'Poista automerkki';
  }
}
