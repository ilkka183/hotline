import BaseForm from '../BaseForm';

export default class UserGroupForm extends BaseForm {
  state = {
    data: {},
    errors: {}
  }

  constructor() {
    super();

    this.addId();
    this.addField('Name',          'Nimi',             'text',   { required: true });
    this.addField('BusinessId',    'Y-tunnus',          'text');
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

    this.state.data = this.getEmptyData();
  }

  getApiName() {
    return 'usergroups';
  }

  getNewTitle() {
    return 'Uusi käyttäjäryhmä';
  }

  getEditTitle() {
    return 'Muokkaa käyttäjäryhmää';
  }

  getDeleteTitle() {
    return 'Poista käyttäjäryhmä';
  }
}
