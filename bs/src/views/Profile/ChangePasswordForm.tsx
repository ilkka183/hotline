import FieldsForm, { FormErrors } from '../../components/common/FieldsForm';
import auth from '../../services/authService';

interface Props {
  user: any
}

export default class ChangePasswordForm extends FieldsForm<Props> {
  constructor(props: Props) {
    super(props);
    
    this.addField('password',     'Nykyinen salasana',       'password', { minLength: 5, required: true });
    this.addField('newPassword1', 'Uusi salasana',           'password', { minLength: 5, required: true });
    this.addField('newPassword2', 'Uusi salasana uudestaan', 'password', { minLength: 5, required: true });

    this.state.data = this.getEmptyData();
  }

  public getTitle(): string {
    return 'Vaihda salasana';
  }

  protected async doSubmit(): Promise<FormErrors | null> {
    try {
      const { password, newPassword1, newPassword2 } = this.state.data;

      if (newPassword1 === newPassword2) {
        try {
          console.log(this.state.data);

          await auth.changePassword(this.props.user.email, password, newPassword1);
        }
        catch (ex) {
          if (ex.response && ex.response.status === 401) {
            const errors: any = {};
            errors.password = 'Nykyinen salasana ei ole oikea';

            return { errors };
          }
        }
      }
      else {
        const errors: any = {};
        errors.newPassword1 = 'Salasanat eivät täsmää';
        errors.newPassword2 = 'Salasanat eivät täsmää';

        return { errors };
      }
    }
    catch (ex) {
      if (ex.response && (ex.response.status === 400 || ex.response.status === 401))
        return { errorText: ex.response.data };
    }

    return null;
  }
}
