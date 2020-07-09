import DataForm from './DataForm';
import ProblemSchema from '../schemas/ProblemSchema';

export default class ProblemForm extends DataForm {
  schema = new ProblemSchema();

  state = {
    data: this.schema.initFormData(),
    errors: {}
  }
}
