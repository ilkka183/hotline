import DataForm from './DataForm';
import MovieSchema from '../schemas/MovieSchema';

export default class MovieForm extends DataForm {
  schema = new MovieSchema();

  state = {
    data: this.schema.initFormData(),
    errors: {}
  }
}
