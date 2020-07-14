import { Schema } from './Schema';

export const FUELS = ['bensiini', 'diesel', 'bensiinihybridi', 'dieselhybridi', 'kaasu', 'sähkö'];
export const STATUSES = ['avoin', 'ratkaistu', 'ratkaisematon'];

export default class ProblemSchema extends Schema {
  constructor() {
    super('Problem');

    this.addField('Id',               'No',                 'number',   { primaryKey: true, required: true, readonly: true, visibleInTable: false });
    this.addField('Date',             'Pvm',                'datetime', { required: true, readonly: true, displayFormat: 'date', editLink: true });
    this.addField('UserId',           'Lähettäjä',          'number',   { required: true, visibleInTable: false, lookupUrl: 'Users' });
    this.addField('UserName',         'Lähettäjä',          'text',     { visibleInTable: false, visibleInForm: false });
    this.addField('Brand',            'Merkki',             'text',     { required: true });
    this.addField('Model',            'Malli',              'text');
    this.addField('ModelYear',        'Vuosimalli',         'number');
    this.addField('ModelBeginYear',   'Vuodesta',           'number',   { visibleInTable: false });
    this.addField('ModelEndYear',     'Vuoteen',            'number',   { visibleInTable: false });
    this.addField('RegistrationYear', 'Rekisteröintivuosi', 'number',   { visibleInTable: false });
    this.addField('Fuel',             'Käyttövoima',        'number',   { enums: FUELS });
    this.addField('Title',            'Otsikko',            'text',     { required: true, link: item => '/problem/' + item.Id });
    this.addField('Description',      'Kuvaus',             'textarea', { required: true });
    this.addField('Replies',          'Vastauksia',         'number',   { visibleInForm: false });
    this.addField('Status',           'Tila',               'number',   { required: true, defaultValue: 0, enums: STATUSES });
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
