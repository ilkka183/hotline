import BaseTable from '../BaseTable';
import auth from '../../services/authService';

export const FUEL_TYPES = ['bensiini', 'diesel', 'bensiinihybridi', 'dieselhybridi', 'kaasu', 'sähkö'];
export const STATUSES = ['avoin', 'ratkaistu', 'ratkaisematon'];

export default class ProblemsTable extends BaseTable {
  user = auth.getCurrentUser();

  constructor() {
    super();

    this.addId();
    this.addField('Date',        'Pvm',         'datetime', { displayFormat: 'date' });
//    this.addField('UserName',    'Lähettäjä',   'text');
    this.addField('Make',        'Merkki',      'text');
    this.addField('Model',       'Malli',       'text');
    this.addField('ModelYear',   'Vuosimalli',  'number');
    this.addField('FuelType',    'Käyttövoima', 'number',   { enums: FUEL_TYPES });
    this.addField('Title',       'Otsikko',     'text',     { link: item => '/problem/' + item.Id });
    this.addField('Description', 'Kuvaus',      'textarea');
//    this.addField('Attachments', 'Liitteitä',   'number');
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

  canDelete(item) {
    return item.UserId === this.user.id || this.user.role === 0;
  }
}
