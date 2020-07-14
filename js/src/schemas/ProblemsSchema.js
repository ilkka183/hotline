import { TableSchema } from './Schemas';

export const FUELS = ['bensiini', 'diesel', 'bensiinihybridi', 'dieselhybridi', 'kaasu', 'sähkö'];
export const STATUSES = ['avoin', 'ratkaistu', 'ratkaisematon'];


export class ProblemsSchema extends TableSchema {
  constructor() {
    super('problems', 'Vikatapaukset');

    this.addField('Id',          'No',          'number',   { visible: false });
    this.addField('Date',        'Pvm',         'datetime', { displayFormat: 'date', editLink: true });
    this.addField('UserId',      'Lähettäjä',   'number',   { lookupUrl: 'Users' });
    this.addField('Brand',       'Merkki',      'text');
    this.addField('Model',       'Malli',       'text');
    this.addField('ModelYear',   'Vuosimalli',  'number');
    this.addField('Fuel',        'Käyttövoima', 'number',   { enums: FUELS });
    this.addField('Title',       'Otsikko',     'text',     { link: item => '/problem/' + item.Id });
    this.addField('Description', 'Kuvaus',      'textarea');
    this.addField('Status',      'Tila',        'number',   { enums: STATUSES });
  }
}
