import { toast } from 'react-toastify';
import FieldsForm from '../../components/common/FieldsForm';
import auth from '../../services/authService';

export default class ChangePasswordForm extends FieldsForm {
  state = {
    data: {},
    errors: {}
  }

  constructor() {
    super();
    
    this.addField('password',     'Nykyinen salasana',       'password', { minLength: 5, required: true });
    this.addField('newPassword1', 'Uusi salasana',           'password', { minLength: 5, required: true });
    this.addField('newPassword2', 'Uusi salasana uudestaan', 'password', { minLength: 5, required: true });

    this.state.data = this.getEmptyData();
  }

  getTitle() {
    return 'Vaihda salasana';
  }

  getButtonLabel() {
    return 'Vaihda salasana';
  }

  async doSubmit() {
    try {
      const { password, newPassword1, newPassword2 } = this.state.data;

      if (newPassword1 === newPassword2) {
        await auth.changePassword(this.user.email, password, newPassword1);
        toast.success('Salasana vaihdettu');
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
