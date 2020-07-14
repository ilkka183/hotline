import { BaseSchema } from './BaseSchema';

export const FUELS = ['bensiini', 'diesel', 'bensiinihybridi', 'dieselhybridi', 'kaasu', 'sähkö'];
export const STATUSES = ['avoin', 'ratkaistu', 'ratkaisematon'];

export class ProblemsSchema extends BaseSchema {
  constructor() {
    super('problems', 'Vikatapaukset');

    this.addField('Id',          'No',          'number',   { required: true, readonly: true, primaryKey: true, visible: false });
    this.addField('Date',        'Pvm',         'datetime', { required: true, readonly: true, displayFormat: 'date', editLink: true });
    this.addField('UserId',      'Lähettäjä',   'number',   { required: true, lookupUrl: 'Users' });
    this.addField('Brand',       'Merkki',      'text',     { required: true });
    this.addField('Model',       'Malli',       'text');
    this.addField('ModelYear',   'Vuosimalli',  'number');
    this.addField('Fuel',        'Käyttövoima', 'number',   { enums: FUELS });
    this.addField('Title',       'Otsikko',     'text',     { required: true, link: item => '/problem/' + item.Id });
    this.addField('Description', 'Kuvaus',      'textarea', { required: true });
    this.addField('Status',      'Tila',        'number',   { required: true, getDefaultValue: () => 0, enums: STATUSES });
  }
}
