import { Schema } from './Schema';

export default class UserSchema extends Schema {
  constructor() {
    super('User');

    this.addField('Id',            'No',               'number',  { primaryKey: true, required: true, visibleInTable: false, visibleInForm: false });
    this.addField('Email',         'Sähköposti',       'email',   { required: true, editLink: true });
    this.addField('Password',      'Salasana',         'text',    { required: true, visibleInTable: false });
    this.addField('FirstName',     'Etunimi',          'text',    { required: true });
    this.addField('LastName',      'Sukunimi',         'text',    { required: true });
    this.addField('Title',         'Toimenkuva',       'text');
    this.addField('Address',       'Osoite',           'text');
    this.addField('PostalCode',    'Postinumero',      'text');
    this.addField('PostOffice',    'Postitoimipaikka', 'text');
    this.addField('Country',       'Maa',              'text');
    this.addField('Phone',         'Puhelin',          'phone');
    this.addField('Website',       'Nettisivut',       'text');
    this.addField('LicenseBegin',  'Lisenssi alku',    'date');
    this.addField('LicenseEnd',    'Lisenssi loppu',   'date');
    this.addField('Enabled',       'Voimassa',         'boolean', { required: true });
  }

  get singularTitle() {
    return 'Käyttäjä';
  }

  get pluralTitle() {
    return 'Käyttäjät';
  }

  get pluralName() {
    return 'users';
  }
}
