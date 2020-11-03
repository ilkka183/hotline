import BaseTable from '../BaseTable';
import BaseForm from '../BaseForm';

const NAME = 'usergroup';


abstract class AbstractUserGroupTable extends BaseTable<{}> {
  protected getTitle(): string {
    return 'Käyttäjäryhmät';
  }

  protected getApiName(): string {
    return NAME;
  }

  protected getModalForm(): any {
    return UserGroupForm;
  }
}


export class UserGroupTable extends AbstractUserGroupTable {
  constructor(props: any) {
    super(props);

    this.addField('Id',            'No',               'number');
    this.addField('Tunnus',        'Tunnus',           'text');
    this.addField('Name',          'Nimi',             'text');
    this.addField('BusinessId',    'Y-tunnus',         'text');
    this.addField('ContactPerson', 'Yhteyshenkilö',    'text');
    this.addField('Address',       'Osoite',           'text');
    this.addField('PostalCode',    'Postinumero',      'text');
    this.addField('PostOffice',    'Postitoimipaikka', 'text');
    this.addField('Country',       'Maa',              'text');
    this.addField('Phone',         'Puhelin',          'tel');
    this.addField('Email',         'Sähköposti',       'email');
    this.addField('Url',           'Nettisivut',       'url');
    this.addField('LogoText',      'Logo teksti',      'text');
    this.addField('LogoFile',      'Logo tiedosto',    'file');
    this.addField('Info',          'Lisätietoja',      'text');
    this.addField('LicenseBegin',  'Lisenssi alku',    'date');
    this.addField('LicenseEnd',    'Lisenssi loppu',   'date');
    this.addField('Class',         'Luokka',           'text');
    this.addField('Enabled',       'Voimassa',         'boolean');
    this.addField('Converted',     'Konvertoitu',      'boolean');
    this.addField('InsertedAt',    'Lisätty',          'datetime');
    this.addField('UpdatedAt',     'Päivitetty',       'datetime');
  }
}


export class UserGroupsTable extends AbstractUserGroupTable {
  constructor(props: any) {
    super(props);

    this.addId();
    this.addName();
    this.addField('Tunnus',        'Tunnus',           'text');
    this.addField('ContactPerson', 'Yhteyshenkilö',    'text');
    this.addField('Address',       'Osoite',           'text');
    this.addField('PostalCode',    'Postinumero',      'text');
    this.addField('PostOffice',    'Postitoimipaikka', 'text');
    this.addField('Phone',         'Puhelin',          'phone');
    this.addField('Url',           'Nettisivut',       'url');
    this.addField('LicenseBegin',  'Lisenssi alku',    'date');
    this.addField('LicenseEnd',    'Lisenssi loppu',   'date');
    this.addEnabled();
    this.addConverted();
  }
}


export default class UserGroupForm extends BaseForm<{}> {
  constructor(props: any) {
    super(props);

    this.addId();
    this.addField('Name',          'Nimi',             'text', { required: true });
    this.addField('Tunnus',        'Tunnus',           'text');
    this.addField('BusinessId',    'Y-tunnus',         'text');
    this.addField('ContactPerson', 'Yhteyshenkilö',    'text');
    this.addField('Address',       'Osoite',           'text');
    this.addField('PostalCode',    'Postinumero',      'text');
    this.addField('PostOffice',    'Postitoimipaikka', 'text');
    this.addField('Country',       'Maa',              'text');
    this.addField('Phone',         'Puhelin',          'phone');
    this.addField('Email',         'Sähköposti',       'email');
    this.addField('Url',           'Nettisivut',       'url');
    this.addField('Class',         'Luokka',           'text', { readonly: true });
    this.addField('LogoText',      'Logo teksti',      'text');
    this.addField('LogoFile',      'Logo tiedosto',    'text');
    this.addField('LicenseBegin',  'Lisenssi alku',    'date');
    this.addField('LicenseEnd',    'Lisenssi loppu',   'date');
    this.addTimestamps(true);
    this.addEnabled();
    this.addConverted();

    this.state.data = this.getEmptyData();
  }

  protected getApiName(): string {
    return NAME;
  }

  protected getInsertTitle(): string {
    return 'Lisää uusi käyttäjäryhmä';
  }

  protected getUpdateTitle(): string {
    return 'Muokkaa käyttäjäryhmää';
  }

  protected getDeleteTitle(): string {
    return 'Poista käyttäjäryhmä';
  }
}
