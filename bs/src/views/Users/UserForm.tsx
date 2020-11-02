import BaseForm from '../BaseForm';
import { USER_ROLES } from '../../services/authService';
import { API_USERS } from './UsersTable';

interface Props {
}

export default class UserForm extends BaseForm<Props> {
  constructor(props: Props) {
    super(props);

    this.addId();
    this.addField('FirstName',    'Etunimi',          'text',     { required: true });
    this.addField('LastName',     'Sukunimi',         'text',     { required: true });
    this.addField('Role',         'Rooli',            'number',   { required: true, enums: USER_ROLES });
    this.addField('GroupId',      'Ryhmä',            'number',   { required: true, lookupUrl: 'UserGroups' });
    this.addField('Email',        'Sähköposti',       'email',    { required: true });
    this.addField('Username',     'Käyttäjätunnus',   'text',     { min: 5, required: true });
    this.addField('Password',     'Salasana',         'password', { min: 5, required: true });
    this.addField('Language',     'Kieli',            'text');
    this.addField('CompanyName',  'Yritys',           'text');
    this.addField('Title',        'Toimenkuva',       'text');
    this.addField('BusinessId',   'Y-tunnus',         'text');
    this.addField('Address',      'Osoite',           'text');
    this.addField('PostalCode',   'Postinumero',      'text');
    this.addField('PostOffice',   'Postitoimipaikka', 'text');
    this.addField('Country',      'Maa',              'text');
    this.addField('Phone',        'Puhelin',          'phone');
    this.addField('Url',          'Nettisivut',       'url');
    this.addField('Class',        'Luokka',           'text');
    this.addField('MaxOpenQuestionCount', 'Avoimia vikatapauksia enintään', 'number');
    this.addField('LicenseBegin',         'Lisenssi alku',                  'date');
    this.addField('LicenseEnd',           'Lisenssi loppu',                 'date');
    this.addField('LastLogin',            'Viimeinen sisäänkirjautuminen',  'datetime', { readonly: true });
    this.addField('LastLogout',           'Viimeinen uloskirjautuminen',    'datetime', { readonly: true });
    this.addTimestamps(true);
    this.addEnabled();
    this.addConverted();

    this.state.data = this.getEmptyData();
  }

  protected getApiName(): string {
    return API_USERS;
  }

  protected getInsertTitle(): string {
    return 'Lisää uusi käyttäjä';
  }

  protected getUpdateTitle(): string {
    return 'Muokkaa käyttäjää';
  }

  protected getDeleteTitle(): string {
    return 'Poista käyttäjä';
  }
}
