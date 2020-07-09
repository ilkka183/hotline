import DataForm from './DataForm';
import BrandSchema from '../schemas/BrandSchema';

export default class BrandForm extends DataForm {
  schema = new BrandSchema();

  state = {
    data: this.schema.initFormData(),
    errors: {}
  }
}
