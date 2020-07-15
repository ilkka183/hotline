import DataForm from '../DataForm';

export default class UserGroupForm extends DataForm {
  state = {
    data: {},
    errors: {}
  }

  constructor() {
    super();

    this.addId();
    this.addField('Name',          'Nimi',             'text',   { required: true });
    this.addField('ContactPerson', 'Yhteyshenkilö',    'text');
    this.addField('Address',       'Osoite',           'text');
    this.addField('PostalCode',    'Postinumero',      'text');
    this.addField('PostOffice',    'Postitoimipaikka', 'text');
    this.addField('Country',       'Maa',              'text');
    this.addField('Phone',         'Puhelin',          'phone');
    this.addField('Email',         'Sähköposti',       'email');
    this.addField('Website',       'Nettisivut',       'text');
    this.addEnabled();
    this.addTimestamps();

    this.state.data = this.emptyData();
  }

  get title() {
    return 'Käyttäjäryhmä';
  }

  get api() {
    return 'usergroups';
  }
}
