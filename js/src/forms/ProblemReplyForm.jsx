import queryString from 'query-string';
import DataForm from './DataForm';
import ProblemReplySchema from '../schemas/ProblemReplySchema';
import auth from '../services/authService';

export default class ProblemReplyForm extends DataForm {
  schema = new ProblemReplySchema();

  state = {
    data: this.schema.initFormData(),
    errors: {}
  }

  constructor(props) {
    super(props);

    this.schema.fieldByName('ProblemId').getDefaultValue = () => {
      const { ProblemId } = queryString.parse(props.location.search);
      return ProblemId;
    };

    this.schema.fieldByName('UserId').getDefaultValue = () => auth.getCurrentUser().id;

    if (this.props.match.params.id === 'new')
      this.state.data = this.schema.initFormData();

    console.log(this.state.data);
  }
}
