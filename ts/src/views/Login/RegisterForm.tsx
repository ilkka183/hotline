import FieldsForm, { FormErrors } from '../../components/common/FieldsForm';
import auth, { User, UserRole } from '../../services/authService';

interface Props {
}

export default class RegisterForm extends FieldsForm<Props> {
  constructor(props: Props) {
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

  protected getSubmitButtonText(): string | undefined {
    return 'Rekisteröidy';
  }

  protected getAsRow(): boolean {
    return false;
  }

  protected async doSubmit(): Promise<FormErrors | null> {
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
      if (ex.response && ex.response.status === 400)
        return { errorText: ex.response.data };
    }

    return null;
  }
}
