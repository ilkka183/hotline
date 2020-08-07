import BaseTable from '../BaseTable';
import UserGroupForm from './UserGroupForm';

export default class UserGroupsTable extends BaseTable<{}> {
  constructor(props: any) {
    super(props);

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

  protected getTitle(): string {
    return 'Käyttäjäryhmät';
  }

  protected getApiName(): string {
    return 'usergroups';
  }

  protected getForm(): string {
    return UserGroupForm;
  }
}
