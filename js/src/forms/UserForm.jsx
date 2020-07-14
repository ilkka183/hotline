import DataForm from './DataForm';
import { FormSchema, USER_ROLES } from '../schemas/Schemas';


class UserSchema extends FormSchema {
  constructor() {
    super('users', 'Käyttäjä');

    this.addId();
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
