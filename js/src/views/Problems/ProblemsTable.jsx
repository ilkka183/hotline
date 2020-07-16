import BaseTable from '../BaseTable';

export const FUELS = ['bensiini', 'diesel', 'bensiinihybridi', 'dieselhybridi', 'kaasu', 'sähkö'];
export const STATUSES = ['avoin', 'ratkaistu', 'ratkaisematon'];

export default class ProblemsTable extends BaseTable {
  constructor() {
    super();

    this.addId();
    this.addField('Date',        'Pvm',         'datetime', { displayFormat: 'date', editLink: true });
    this.addField('Brand',       'Merkki',      'text');
    this.addField('Model',       'Malli',       'text');
    this.addField('ModelYear',   'Vuosimalli',  'number');
    this.addField('Fuel',        'Käyttövoima', 'number',   { enums: FUELS });
    this.addField('Title',       'Otsikko',     'text',     { link: item => '/problem/' + item.Id });
    this.addField('Description', 'Kuvaus',      'textarea');
    this.addField('Replies',     'Vastauksia',  'number');
    this.addField('Status',      'Tila',        'number',   { enums: STATUSES });
  }

  getTitle() {
    if (this.props.title)
      return this.props.title;

    return 'Vikatapaukset';
  }

  getApiName() {
    return 'problems';
  }

  getItemsEndpoint(path) {
    let url = path;

    if (this.props.status !== undefined)
      url += '?Status=' + this.props.status;

    return url;
  }
}
