import DataForm from '../DataForm';
import auth from '../../services/authService';

export default class ProfileForm extends DataForm {
  state = {
    data: {},
    errors: {}
  }

  constructor() {
    super();
    
    this.addId();
    this.addField('FirstName',  'Etunimi',          'text',   { required: true, readonly: true });
    this.addField('LastName',   'Sukunimi',         'text',   { required: true, readonly: true });
    this.addField('Role',       'Rooli',            'number', { readonly: true, enums: ['pääkäyttäjä', 'tehokäyttäjä', 'käyttäjä', 'demokäyttäjä'] });
    this.addField('Title',      'Toimenkuva',       'text');
    this.addField('Address',    'Osoite',           'text');
    this.addField('PostalCode', 'Postinumero',      'text');
    this.addField('PostOffice', 'Postitoimipaikka', 'text');
    this.addField('Country',    'Maa',              'text');
    this.addField('Phone',      'Puhelin',          'phone');

    this.state.data = this.schema.emptyData();
  }

  get dataId() {
    return auth.getCurrentUser().id;
  }

  afterSubmit() {
    // do nothing
  }
}
