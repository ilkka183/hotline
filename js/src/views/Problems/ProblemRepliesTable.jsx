import BaseTable from '../BaseTable';

export default class ProblemRepliessTable extends BaseTable {
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
}
