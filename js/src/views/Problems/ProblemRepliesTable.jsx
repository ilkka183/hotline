import BaseTable from '../BaseTable';
import auth from '../../services/authService';

export default class ProblemRepliessTable extends BaseTable {
  user = auth.getCurrentUser();

  constructor() {
    super();

    this.addId();
    this.addField('ProblemId', 'Vikatapaus', 'number',   { visible: false });
    this.addField('Date',      'Pvm',        'datetime', { displayFormat: 'date' });
    this.addField('UserName',  'Lähettäjä',  'text');
    this.addField('Message',   'Viesti',     'textarea', { editLink: true, rows: 5 });
    this.addField('Solution',  'Ratkaisu',   'boolean');
  }

  getTitle() {
    return 'Vastaukset';
  }

  getApiName() {
    return 'problemreplies';
  }

  getNewButtonLink() {
    return `/${this.getApiName()}/new?ProblemId=${this.props.problemId}`;
  }

  getItemsEndpoint(path) {
    return path + '?ProblemId=' + this.props.problemId;
  }

  canEdit(item) {
    return item.UserId === this.user.id || this.user.role === 0;
  }

  canDelete(item) {
    return item.UserId === this.user.id || this.user.role === 0;
  }
}
