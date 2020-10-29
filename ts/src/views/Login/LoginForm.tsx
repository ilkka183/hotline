import FieldsForm, { FormErrors } from '../../components/common/FieldsForm';
import auth from '../../services/authService';

interface Props {
}

export default class LoginForm extends FieldsForm<Props> {
  constructor(props: Props) {
    super(props);
    
    this.addField('username', 'Käyttäjätunnus', 'text',     { required: true });
    this.addField('password', 'Salasana',       'password', { min: 5, required: true });

    this.state.data = this.getEmptyData();
  }

  public getTitle(): string {
    return 'Kirjaudu';
  }

  protected getSubmitButtonText(): string | undefined {
    return 'Kirjaudu';
  }

  protected getAsRow(): boolean {
    return false;
  }

  protected async doSubmit(): Promise<FormErrors | null> {
    try {
      const { username, password } = this.state.data;
      console.log('login1');
      await auth.login(username, password);
      console.log('login2');
      window.location.replace('/');
    }
    catch (ex) {
      if (ex.response && (ex.response.status === 400 || ex.response.status === 401))
        return { errorText: ex.response.data };
    }

    return null;
  }
}
