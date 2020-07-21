import { toast } from 'react-toastify';
import BaseForm from '../BaseForm';

export default class ProfileForm extends BaseForm {
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

    this.state.data = this.getEmptyData();
  }

  getTitle() {
    return 'Omat tiedot';
  }

  getApiName() {
    return 'users';
  }

  get dataId() {
    return this.user.id;
  }

  afterSubmit() {
    toast.success('Omat tiedot talletettu');
  }
}
