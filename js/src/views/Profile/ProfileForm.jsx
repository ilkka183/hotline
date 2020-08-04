import BaseForm from '../BaseForm';

export default class ProfileForm extends BaseForm {
  state = {
    data: {},
    errors: {}
  }

  constructor(props) {
    super(props);
    
    this.addId();
    this.addField('FirstName',    'Etunimi',          'text',   { required: true, readonly: true });
    this.addField('LastName',     'Sukunimi',         'text',   { required: true, readonly: true });
    this.addField('Role',         'Rooli',            'number', { required: true, readonly: true, enums: ['pääkäyttäjä', 'tehokäyttäjä', 'käyttäjä', 'demokäyttäjä'] });
    this.addField('GroupId',      'Ryhmä',            'number', { required: true, readonly: true, lookupUrl: 'UserGroups' });
    this.addField('BusinessId',   'Y-tunnus',         'text');
    this.addField('Title',        'Toimenkuva',       'text');
    this.addField('Address',      'Osoite',           'text');
    this.addField('PostalCode',   'Postinumero',      'text');
    this.addField('PostOffice',   'Postitoimipaikka', 'text');
    this.addField('Country',      'Maa',              'text');
    this.addField('Phone',        'Puhelin',          'phone');
    this.addField('LicenseBegin', 'Lisenssi alku',    'date',  { readonly: true });
    this.addField('LicenseEnd',   'Lisenssi loppu',   'date',  { readonly: true });
    this.addField('MaxOpenProblemCount', 'Avoimia vikatapauksia enintään', 'number', { readonly: true });

    this.state.data = this.getEmptyData();
  }

  getApiName() {
    return 'users';
  }

  getEditTitle() {
    return 'Muokkaa omia tietoja';
  }

  get dataId() {
    return this.props.userId;
  }
}
