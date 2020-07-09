import DataForm from './DataForm';
import UserSchema from '../schemas/UserSchema';

export default class UserForm extends DataForm {
  schema = new UserSchema();

  state = {
    data: this.schema.initFormData(),
    errors: {}
  }
}
