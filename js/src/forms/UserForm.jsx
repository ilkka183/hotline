import DataForm from './DataForm';
import { BaseSchema, USER_ROLES } from '../schemas/BaseSchema';


class UserSchema extends BaseSchema {
  constructor() {
    super('users', 'Käyttäjä');

    this.addField('Id',           'No',               'number', { required: true, readonly: true, primaryKey: true, visible: false });
    this.addField('FirstName',    'Etunimi',          'text',   { required: true });
    this.addField('LastName',     'Sukunimi',         'text',   { required: true });
    this.addField('Role',         'Rooli',            'number', { required: true, enums: USER_ROLES });
    this.addField('GroupId',      'Ryhmä',            'number', { required: true, lookupUrl: 'UserGroups' });
    this.addField('Email',        'Sähköposti',       'email',  { required: true });
    this.addField('Password',     'Salasana',         'text',   { required: true });
    this.addField('Title',        'Toimenkuva',       'text');
    this.addField('Address',      'Osoite',           'text');
    this.addField('PostalCode',   'Postinumero',      'text');
    this.addField('PostOffice',   'Postitoimipaikka', 'text');
    this.addField('Country',      'Maa',              'text');
    this.addField('Phone',        'Puhelin',          'phone');
    this.addField('Website',      'Nettisivut',       'text');
    this.addField('LicenseBegin', 'Lisenssi alku',    'date');
    this.addField('LicenseEnd',   'Lisenssi loppu',   'date');
    this.addEnabled();
    this.addTimestamps();
  }
}


export default class UserForm extends DataForm {
  schema = new UserSchema();

  state = {
    data: this.schema.emptyData(),
    errors: {}
  }
}
