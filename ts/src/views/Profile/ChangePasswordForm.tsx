import FieldsForm from '../../components/common/FieldsForm';
import auth from '../../services/authService';

interface Props {
  user: any
}

export default class ChangePasswordForm extends FieldsForm<Props> {
  constructor(props: any) {
    super(props);
    
    this.addField('password',     'Nykyinen salasana',       'password', { minLength: 5, required: true });
    this.addField('newPassword1', 'Uusi salasana',           'password', { minLength: 5, required: true });
    this.addField('newPassword2', 'Uusi salasana uudestaan', 'password', { minLength: 5, required: true });

    this.state.data = this.getEmptyData();
  }

  public getTitle(): string {
    return 'Vaihda salasana';
  }

  handleSubmitModal = async () => {
    const { onSubmitModal } = this.props;

    if (this.hasErrors())
      return;

    try {
      const { password, newPassword1, newPassword2 } = this.state.data;

      if (newPassword1 === newPassword2) {
        try {
          console.log(this.props);

          await auth.changePassword(this.props.user.email, password, newPassword1);

          if (onSubmitModal)
            onSubmitModal();
        }
        catch (ex) {
          if (ex.response && ex.response.status === 401) {
            const errors = { ...this.state.errors };
            errors.password = 'Nykyinen salasana ei ole oikea';

            this.setState({ errors });
          }
        }
      }
      else {
        const errors = { ...this.state.errors };
        errors.newPassword1 = 'Salasanat eivät täsmää';
        errors.newPassword2 = 'Salasanat eivät täsmää';

        this.setState({ errors });
      }
    }
    catch (ex) {
      if (ex.response && (ex.response.status === 400 || ex.response.status === 401)) {
        const errors = { ...this.state.errors };
        errors.password = ex.response.data;

        this.setState({ errors });
      }
    }
  }
}
