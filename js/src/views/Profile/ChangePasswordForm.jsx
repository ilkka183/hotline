import FieldsForm from '../../components/common/FieldsForm';

export default class ChangePasswordForm extends FieldsForm {
  state = {
    data: {},
    errors: {}
  }

  constructor() {
    super();
    
    this.addField('password',  'Nykyinen salasana',       'text', { min: 5, required: true });
    this.addField('password1', 'Uusi salasana',           'text', { min: 5, required: true });
    this.addField('password2', 'Uusi salasana uudestaan', 'text', { min: 5, required: true });

    this.state.data = this.emptyData();
  }

  get title() {
    return 'Vaihda salasana';
  }

  get buttonLabel() {
    return 'Vaihda salasana';
  }

  async doSubmit() {
  }
}
