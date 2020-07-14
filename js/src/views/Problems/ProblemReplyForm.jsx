import DataForm from '../DataForm';
import { FormSchema } from '../../schemas/Schemas';
import queryString from 'query-string';
import auth from '../../services/authService';


class ProblemReplySchema extends FormSchema {
  constructor(props) {
    super('problemreplies', 'Vastaus');

    this.addId();
    this.addField('ProblemId', 'Vikatapaus', 'number',   { required: true, readonly: true, visible: false, getDefaultValue: () => queryString.parse(props.location.search).ProblemId });
    this.addField('Date',      'Pvm',        'datetime', { required: true, readonly: true });
    this.addField('UserId',    'Lähettäjä',  'number',   { required: true, readonly: true, lookupUrl: 'Users', getDefaultValue: () => auth.getCurrentUser().id });
    this.addField('Message',   'Viesti',     'textarea', { required: true, rows: 5 });
    this.addField('Solution',  'Ratkaisu',   'boolean',  { required: true, getDefaultValue: () => false });
  }
}


export default class ProblemReplyForm extends DataForm {
  schema = new ProblemReplySchema(this.props);

  state = {
    data: this.schema.emptyData(),
    errors: {}
  }
}
