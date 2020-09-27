import BaseTable from '../BaseTable';
import UserGroupForm from './UserGroupForm';

export const API_USER_GROUPS = 'usergroups';

interface Props {
}

export default class UserGroupsTable extends BaseTable<Props> {
  constructor(props: Props) {
    super(props);

    this.addId();
    this.addField('Tunnus',        'Tunnus',           'text');
    this.addName();
    this.addField('ContactPerson', 'Yhteyshenkilö',    'text');
    this.addField('Address',       'Osoite',           'text');
    this.addField('PostalCode',    'Postinumero',      'text');
    this.addField('PostOffice',    'Postitoimipaikka', 'text');
    this.addField('Country',       'Maa',              'text');
    this.addField('Osoite',        'Osoite',           'text');
    this.addField('Phone',         'Puhelin',          'phone');
    this.addField('Email',         'Sähköposti',       'email');
    this.addField('Url',           'Nettisivut',       'url');
    this.addField('LicenseBegin',  'Lisenssi alku',    'date');
    this.addField('LicenseEnd',    'Lisenssi loppu',   'date');
    this.addEnabled();
  }

  protected getTitle(): string {
    return 'Käyttäjäryhmät';
  }

  protected getApiName(): string {
    return API_USER_GROUPS;
  }

  protected getModalForm(): any {
    return UserGroupForm;
  }
}
