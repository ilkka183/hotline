import BaseTable from '../BaseTable';
import http from '../../services/httpService';

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

  async getItems() {
    return await http.get(this.apiEndpoint + '?ProblemId=' + this.props.problemId);
  }

  async deleteItem(item) {
    return await http.delete(this.apiEndpoint + '/' + item.Id);
  }
}
