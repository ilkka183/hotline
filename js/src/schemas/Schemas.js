import { Schema } from './Schema';

export const USER_ROLES = ['pääkäyttäjä', 'tehokäyttäjä', 'käyttäjä', 'demokäyttäjä'];


export class TableSchema extends Schema {
  addEnabled() {
    this.addField('Enabled', 'Voimassa', 'boolean', { required: true, getDefaultValue: () => true });
  }
}


export class FormSchema extends Schema {
  addId() {
    this.addField('Id', 'No', 'number',  { primaryKey: true, readonly: true, visible: false });
  }

  addEnabled() {
    this.addField('Enabled', 'Voimassa', 'boolean', { required: true, getDefaultValue: () => true });
  }

  addTimestamps() {
    this.addField('CreatedAt', 'Luotu',    'datetime', { required: true, readonly: true, visibleInTable: false });
    this.addField('UpdatedAt', 'Muokattu', 'datetime', { readonly: true, visibleInTable: false });
  }
}