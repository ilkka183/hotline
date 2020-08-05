import FieldsForm from '../../components/common/FieldsForm';
import auth from '../../services/authService';

export default class LoginForm extends FieldsForm {
  state = {
    data: {},
    errors: {}
  }

  constructor() {
    super();
    
    this.addField('email',    'Sähköposti', 'text',     { email: true, required: true });
    this.addField('password', 'Salasana',   'password', { min: 5, required: true });

    this.state.data = this.getEmptyData();
  }

  getTitle() {
    return 'Kirjaudu';
  }

  getButtonLabel() {
    return 'Kirjaudu';
  }

  getAsRow() {
    return false;
  }

  async doSubmit() {
    try {
      const { email, password } = this.state.data;
      await auth.login(email, password);
      window.location = '/';
    }
    catch (ex) {
      if (ex.response && (ex.response.status === 400 || ex.response.status === 401)) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;

        this.setState({ errors });
      }
    }
  }
}
