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

  get api() {
    return 'problemreplies';
  }
}
