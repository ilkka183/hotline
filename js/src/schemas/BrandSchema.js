import { Schema } from './Schema';

export default class BrandSchema extends Schema {
  constructor() {
    super('Brand');

    this.addField('Id',      'No',       'number',  { primaryKey: true, required: true, visibleInTable: false, visibleInForm: false });
    this.addField('Name',    'Nimi',     'text',    { required: true, editLink: true });
    this.addField('Enabled', 'Voimassa', 'boolean', { required: true, defaultValue: true });
  }

  get singularTitle() {
    return 'Automerkki';
  }

  get pluralTitle() {
    return 'Automerkit';
  }

  get pluralName() {
    return 'brands';
  }
}
