import BaseForm from '../BaseForm';
import queryString from 'query-string';
import auth from '../../services/authService';

export default class ProblemReplyForm extends BaseForm {
  state = {
    data: {},
    errors: {}
  }

  constructor(props) {
    super(props);

    this.addId();
    this.addField('ProblemId', 'Vikatapaus', 'number',   { required: true, readonly: true, visible: false, getDefaultValue: () => queryString.parse(props.location.search).ProblemId });
    this.addField('Date',      'Pvm',        'datetime', { required: true, readonly: true });
    this.addField('UserId',    'Lähettäjä',  'number',   { required: true, readonly: true, lookupUrl: 'Users', getDefaultValue: () => auth.getCurrentUser().id });
    this.addField('Message',   'Viesti',     'textarea', { required: true, rows: 5 });
    this.addField('Solution',  'Ratkaisu',   'boolean',  { required: true, getDefaultValue: () => false });

    this.state.data = this.getEmptyData();
  }

  get title() {
    return 'Vastaus';
  }

  get api() {
    return 'problemreplies';
  }
}
