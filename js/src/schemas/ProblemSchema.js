import { Schema } from './Schema';

export default class ProblemSchema extends Schema {
  constructor() {
    super('Problem');

    this.addField('Id',          'No',          'number',   { primaryKey: true, required: true, visibleInTable: false, visibleInForm: false });
    this.addField('Date',        'Pvm',         'datetime', { required: true, readonly: true, displayFormat: 'date', editLink: true });
    this.addField('UserId',      'Lähettäjä',   'number',   { required: true, visibleInTable: false, lookupUrl: 'Users' });
    this.addField('UserName',    'Lähettäjä',   'text',     { visibleInForm: false });
    this.addField('Brand',       'Merkki',      'text',     { required: true });
    this.addField('Model',       'Malli',       'text');
    this.addField('ModelYear',   'Vuosimalli',  'number');
    this.addField('Fuel',        'Käyttövoima', 'number',   { enums: ['bensiini', 'diesel', 'kaasu', 'sähkö'] });
    this.addField('Title',       'Otsikko',     'text',     { required: true, editLink: true });
    this.addField('Description', 'Kuvaus',      'textarea', { required: true });
    this.addField('Status',      'Tila',        'number',   { required: true, defaultValue: 0, enums: ['avoin', 'ratkaistu', 'ratkaisematon'] });
  }

  get singularTitle() {
    return 'Vikatapaus';
  }

  get pluralTitle() {
    return 'Vikatapaukset';
  }

  get pluralName() {
    return 'problems';
  }
}
