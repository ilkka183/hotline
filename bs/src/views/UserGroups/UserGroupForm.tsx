import BaseForm from '../BaseForm';
import { API_USER_GROUPS } from './UserGroupsTable';

interface Props {
}

export default class UserGroupForm extends BaseForm<Props> {
  constructor(props: Props) {
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
    return API_USER_GROUPS;
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
