import { Schema } from './Schema';

export default class BrandSchema extends Schema {
  constructor() {
    super('Brand');

    this.addField('Id',   'No',   'number', { primaryKey: true, required: true, visibleInTable: false, visibleInForm: false });
    this.addField('Name', 'Nimi', 'text',   { required: true, editLink: true });
    this.addField('Info', 'Info', 'textarea');
    this.addEnabled();
    this.addTimestamps();
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
