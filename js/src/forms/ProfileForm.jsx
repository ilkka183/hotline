import DataForm from './DataForm';
import { Schema } from '../schemas/Schema';
import auth from '../services/authService';


class ProfileSchema extends Schema {
  constructor() {
    super('ChangePassword');
    
    this.addField('Id',         'No',               'number', { primaryKey: true, required: true, visibleInForm: false });
    this.addField('FirstName',  'Etunimi',          'text',   { required: true, readonly: true });
    this.addField('LastName',   'Sukunimi',         'text',   { required: true, readonly: true });
    this.addField('Role',       'Rooli',            'number', { readonly: true, enums: ['pääkäyttäjä', 'tehokäyttäjä', 'käyttäjä', 'demokäyttäjä'] });
    this.addField('Title',      'Toimenkuva',       'text');
    this.addField('Address',    'Osoite',           'text');
    this.addField('PostalCode', 'Postinumero',      'text');
    this.addField('PostOffice', 'Postitoimipaikka', 'text');
    this.addField('Country',    'Maa',              'text');
    this.addField('Phone',      'Puhelin',          'phone');
  }

  get singularTitle() {
    return 'Omat tiedot';
  }

  get pluralName() {
    return 'users';
  }
}


export default class ProfileForm extends DataForm {
  schema = new ProfileSchema()

  state = {
    data: this.schema.emptyFormData(),
    errors: {}
  }

  get dataId() {
    return auth.getCurrentUser().id;
  }
}
