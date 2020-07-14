import { Schema } from './Schema';

export default class ProblemReplySchema extends Schema {
  constructor() {
    super('Problem');

    this.addField('Id',        'No',         'number',   { primaryKey: true, required: true, readonly: true, visibleInTable: false, visibleInForm: false });
    this.addField('ProblemId', 'Vikatapaus', 'number',   { required: true, readonly: true, visibleInTable: false, visibleInForm: false });
    this.addField('Date',      'Pvm',        'datetime', { required: true, readonly: true, displayFormat: 'date' });
    this.addField('UserId',    'Lähettäjä',  'number',   { required: true, readonly: true, visibleInTable: false, lookupUrl: 'Users' });
    this.addField('UserName',  'Lähettäjä',  'text',     { excludeInForm: true, visibleInForm: false });
    this.addField('Message',   'Viesti',     'textarea', { required: true, editLink: true, rows: 5 });
    this.addField('Solution',  'Ratkaisu',   'boolean',  { required: true, getDefaultValue: () => false });
  }

  get singularTitle() {
    return 'Vastaus';
  }

  get pluralTitle() {
    return 'Vastaukset';
  }

  get pluralName() {
    return 'problemreplies';
  }
}
