import DataForm from './DataForm';
import ProblemReplySchema from '../schemas/ProblemReplySchema';

export default class ProblemReplyForm extends DataForm {
  schema = new ProblemReplySchema();

  state = {
    data: this.schema.initFormData(),
    errors: {}
  }
}
