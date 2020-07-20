import DataForm from '../components/common/DataForm';
import http from '../services/httpService';

const SHOW_IDS = true;

export default class BaseForm extends DataForm {
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
    const { history, onSubmitted } = this.props;

    if (onSubmitted)
      onSubmitted();

    if (history)
      history.goBack();
  }
}
