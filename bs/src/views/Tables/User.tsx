import BaseTable from '../BaseTable';
import BaseForm from '../BaseForm';
import { USER_ROLES } from '../../services/authService';

const NAME = 'user';


abstract class AbstractUserTable extends BaseTable<{}> {
  protected getTitle(): string {
    return 'Käyttäjät';
  }

  protected getApiName(): string {
    return NAME;
  }

  protected getModalForm(): any {
    return UserForm;
  }
}


export class UserTable extends AbstractUserTable {
  constructor(props: any) {
    super(props);

    this.addField('Id',           'No',               'number');
    this.addField('GroupName',    'Ryhmä',            'text');
    this.addField('Role',         'Rooli',            'number');
    this.addField('Email',        'Sähköposti',       'email');
    this.addField('Username',     'Käyttäjätunnus',   'text');
    this.addField('Password',     'Salasana',         'password');
    this.addField('FirstName',    'Etunimi',          'text');
    this.addField('LastName',     'Sukunimi',         'text');
    this.addField('Language',     'Kieli',            'text');
    this.addField('CompanyName',  'Yritys',           'text');
    this.addField('Title',        'Toimenkuva',       'text');
    this.addField('BusinessId',   'Y-tunnus',         'text');
    this.addField('Address',      'Osoite',           'text');
    this.addField('PostalCode',   'Postinumero',      'text');
    this.addField('PostOffice',   'Postitoimipaikka', 'text');
    this.addField('Country',      'Maa',              'text');
    this.addField('Phone',        'Puhelin',          'tel');
    this.addField('Fax',          'Faksi',            'tel');
    this.addField('Url',          'Nettisivut',       'url');
    this.addField('Info',         'Lisätietoja',      'text');
    this.addField('LastLogin',    'Viimeinen kirjautuminen',     'date');
    this.addField('LastLogout',   'Viimeinen uloskirjautuminen', 'date');
    this.addField('LicenseBegin', 'Lisenssi alku',    'date');
    this.addField('LicenseEnd',   'Lisenssi loppu',   'date');
    this.addField('Class',        'Luokkaa',          'text');
    this.addField('Enabled',      'Voimassa',         'boolean');
    this.addField('Converted',    'Konvertoitu',      'boolean');
    this.addField('CreatedAt',    'Lisätty',          'datetime');
    this.addField('UpdatedAt',    'Päivitetty',       'datetime');
  }
}


export class UsersTable extends AbstractUserTable {
  constructor(props: any) {
    super(props);

    this.addId();
    this.addName('FirstName',     'Etunimi');
    this.addName('LastName',      'Sukunimi');
    this.addField('Username',     'Käyttäjätunnus',   'text',   { visible: false });
    this.addField('Role',         'Rooli',            'number', { enums: USER_ROLES });
    this.addField('GroupName',    'Ryhmä',            'text');
    this.addField('CompanyName',  'Yritys',           'text');
    this.addField('Title',        'Toimenkuva',       'text');
    this.addField('Address',      'Osoite',           'text');
    this.addField('PostalCode',   'Postinumero',      'text');
    this.addField('PostOffice',   'Postitoimipaikka', 'text');
    this.addField('Email',        'Sähköposti',       'email', { visible: false });
    this.addField('Phone',        'Puhelin',          'tel',   { visible: false });
    this.addField('LicenseBegin', 'Lisenssi alku',    'date');
    this.addField('LicenseEnd',   'Lisenssi loppu',   'date');
    this.addEnabled();
    this.addConverted();
  }
}


export default class UserForm extends BaseForm<{}> {
  constructor(props: any) {
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
    return NAME;
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
