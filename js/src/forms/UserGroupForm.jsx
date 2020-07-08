import DataForm from './DataForm';
import UserGroupSchema from '../schemas/UserGroupSchema';

export default class UserGroupForm extends DataForm {
  schema = new UserGroupSchema();

  state = {
    data: this.schema.initFormData(),
    errors: {}
  }
}
