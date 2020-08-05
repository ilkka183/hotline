import DataForm from '../components/common/DataForm';
import auth, { UserRole } from '../services/authService';
import http from '../services/httpService';

const SHOW_IDS = true;

export default class BaseForm extends DataForm {
  user = auth.getCurrentUser();

  get hasPowerRights() {
    return this.user.role <= UserRole.Power;
  }

  getHttp() {
    return http;
  }

  addId(visible = SHOW_IDS) {
    this.addField('Id', 'No', 'number',  { primaryKey: true, readonly: true, visible });
  }

  addEnabled() {
    this.addField('Enabled', 'Voimassa', 'boolean', { required: true, getDefaultValue: () => true });
  }

  addTimestamps() {
    this.addField('CreatedAt', 'Luotu',    'datetime', { required: true, readonly: true, visibleInTable: false });
    this.addField('UpdatedAt', 'Muokattu', 'datetime', { readonly: true, visibleInTable: false });
  }

  afterSubmit() {
    const { onSubmitted } = this.props;

    if (onSubmitted)
      onSubmitted();

    this.goBack();
  }
}
