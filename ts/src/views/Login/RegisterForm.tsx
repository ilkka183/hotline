import FieldsForm, { FieldsFormProps } from '../../components/common/FieldsForm';
import auth from '../../services/authService';

export default class RegisterForm extends FieldsForm<{}> {
  constructor(props: FieldsFormProps) {
    super(props);

    this.addField('email',     'Sähköposti', 'email', { required: true });
    this.addField('password',  'Salasana',   'text',  { min: 5, required: true });
    this.addField('firstName', 'Etunimi',    'text',  { required: true });
    this.addField('lastName',  'Sukunimi',   'text',  { required: true });

    this.state.data = this.getEmptyData();
  }

  getTitle() {
    return 'Rekisteröidy';
  }

  getButtonLabel() {
    return 'Rekisteröidy';
  }

  getAsRow() {
    return false;
  }

  async doSubmit() {
    try {
      const data = {
        id: 1,
        firstName: this.state.data.firstName,
        lastName: this.state.data.lastName,
        email: this.state.data.email,
        phone: '',
        role: 2
      }

      await auth.register(data);
//      window.location = '/';
    }
    catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data.sqlMessage;

        this.setState({ errors });
      }
    }
  }
}
