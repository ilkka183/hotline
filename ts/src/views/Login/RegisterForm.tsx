import FieldsForm from '../../components/common/FieldsForm';
import auth, { User, UserRole } from '../../services/authService';

export default class RegisterForm extends FieldsForm<{}> {
  constructor(props: any) {
    super(props);

    this.addField('email',     'Sähköposti', 'email', { required: true });
    this.addField('password',  'Salasana',   'text',  { min: 5, required: true });
    this.addField('firstName', 'Etunimi',    'text',  { required: true });
    this.addField('lastName',  'Sukunimi',   'text',  { required: true });

    this.state.data = this.getEmptyData();
  }

  public getTitle(): string {
    return 'Rekisteröidy';
  }

  protected getButtonLabel(): string {
    return 'Rekisteröidy';
  }

  protected getAsRow(): boolean {
    return false;
  }

  protected async doSubmit() {
    try {
      const user: User = new User({
        id: 1,
        firstName: this.state.data.firstName,
        lastName: this.state.data.lastName,
        email: this.state.data.email,
        phone: '',
        role: UserRole.User
      });

      await auth.register(user);
      window.location.replace('/');
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
