import { Schema } from './Schema';

export default class ProblemSchema extends Schema {
  constructor() {
    super('Problem');

    this.addField('Id',     'No',      'number', { primaryKey: true, required: true, visibleInTable: false, visibleInForm: false });
    this.addField('Title',  'Otsikko', 'text',   { required: true, editLink: true });
    this.addField('Status', 'Tila',    'number', { required: true, defaultValue: 0 });
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
