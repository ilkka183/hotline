import FieldsForm, { FieldsFormProps } from '../../components/common/FieldsForm';
import auth from '../../services/authService';

export default class LoginForm extends FieldsForm<{}> {
  constructor(props: FieldsFormProps) {
    super(props);
    
    this.addField('email',    'Sähköposti', 'email',    { required: true });
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
