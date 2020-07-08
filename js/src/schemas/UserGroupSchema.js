import { Schema } from './Schema';

export default class UserGroupSchema extends Schema {
  constructor() {
    super('UserGroup');

    this.addField('Id',            'No',               'number',  { primaryKey: true, required: true, visibleInTable: false, visibleInForm: false });
    this.addField('Name',          'Nimi',             'text',    { required: true, editLink: true });
    this.addField('ContactPerson', 'Yhteyshenkilö',    'text');
    this.addField('Address',       'Osoite',           'text');
    this.addField('PostalCode',    'Postinumero',      'text');
    this.addField('PostOffice',    'Postitoimipaikka', 'text');
    this.addField('Country',       'Maa',              'text');
    this.addField('Phone',         'Puhelin',          'phone');
    this.addField('Email',         'Sähköposti',       'email');
    this.addField('Website',       'Nettisivut',       'text');
    this.addField('Enabled',       'Voimassa',         'boolean', { required: true });
  }

  get singularTitle() {
    return 'Käyttäjäryhmä';
  }

  get pluralTitle() {
    return 'Käyttäjäryhmät';
  }

  get pluralName() {
    return 'usergroups';
  }
}
