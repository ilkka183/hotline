import BaseTable from '../BaseTable';
import UserGroupForm from './UserGroupForm';

export default class UserGroupsTable extends BaseTable {
  constructor() {
    super();

    this.addId();
    this.addName();
    this.addField('ContactPerson', 'Yhteyshenkilö',    'text');
    this.addField('Address',       'Osoite',           'text');
    this.addField('PostalCode',    'Postinumero',      'text');
    this.addField('PostOffice',    'Postitoimipaikka', 'text');
    this.addField('Country',       'Maa',              'text');
    this.addField('Phone',         'Puhelin',          'phone');
    this.addField('Email',         'Sähköposti',       'email');
    this.addField('Website',       'Nettisivut',       'text');
    this.addEnabled();
  }

  getTitle() {
    return 'Käyttäjäryhmät';
  }

  getApiName() {
    return 'usergroups';
  }

  getForm() {
    return UserGroupForm;
  }
}
