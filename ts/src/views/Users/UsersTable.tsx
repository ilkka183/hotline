import BaseTable from '../BaseTable';
import UserForm from './UserForm';
import { USER_ROLES } from '../../services/authService';

export const API_USERS = 'users';

interface Props {
}

export default class UsersTable extends BaseTable<Props> {
  constructor(props: Props) {
    super(props);

    this.addId();
    this.addName('FirstName',     'Etunimi');
    this.addName('LastName',      'Sukunimi');
    this.addField('Role',         'Rooli',            'number', { enums: USER_ROLES });
    this.addField('GroupName',    'Ryhmä',            'text');
    this.addField('Title',        'Toimenkuva',       'text');
    this.addField('Address',      'Osoite',           'text');
    this.addField('PostalCode',   'Postinumero',      'text');
    this.addField('PostOffice',   'Postitoimipaikka', 'text');
    this.addField('Country',      'Maa',              'text');
    this.addField('LicenseBegin', 'Lisenssi alku',    'date');
    this.addField('LicenseEnd',   'Lisenssi loppu',   'date');
    this.addEnabled();
  }

  protected getTitle(): string {
    return 'Käyttäjät';
  }

  protected getApiName(): string {
    return API_USERS;
  }

  protected getModalForm(): any {
    return UserForm;
  }
}
