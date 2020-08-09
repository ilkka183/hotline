import BaseForm from '../BaseForm';
import { USER_ROLES } from '../../services/authService';
import { API_USERS } from './UsersTable';

interface Props {
}

export default class UserForm extends BaseForm<Props> {
  constructor(props: Props) {
    super(props);

    this.addId();
    this.addField('FirstName',    'Etunimi',          'text',   { required: true });
    this.addField('LastName',     'Sukunimi',         'text',   { required: true });
    this.addField('Role',         'Rooli',            'number', { required: true, enums: USER_ROLES });
    this.addField('GroupId',      'Ryhmä',            'number', { required: true, lookupUrl: 'UserGroups' });
    this.addField('Email',        'Sähköposti',       'email',  { required: true });
    this.addField('Password',     'Salasana',         'text',   { required: true });
    this.addField('Title',        'Toimenkuva',       'text');
    this.addField('BusinessId',   'Y-tunnus',         'text');
    this.addField('Address',      'Osoite',           'text');
    this.addField('PostalCode',   'Postinumero',      'text');
    this.addField('PostOffice',   'Postitoimipaikka', 'text');
    this.addField('Country',      'Maa',              'text');
    this.addField('Phone',        'Puhelin',          'phone');
    this.addField('Website',      'Nettisivut',       'text');
    this.addField('LicenseBegin', 'Lisenssi alku',    'date');
    this.addField('LicenseEnd',   'Lisenssi loppu',   'date');
    this.addField('MaxOpenProblemCount', 'Avoimia vikatapauksia enintään', 'number');
    this.addEnabled();
    this.addTimestamps();

    this.state.data = this.getEmptyData();
  }

  protected getApiName(): string {
    return API_USERS;
  }

  protected getNewTitle(): string {
    return 'Uusi käyttäjä';
  }

  protected getEditTitle(): string {
    return 'Muokkaa käyttäjää';
  }

  protected getDeleteTitle(): string {
    return 'Poista käyttäjä';
  }
}
