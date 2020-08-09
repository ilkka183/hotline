import BaseForm from '../BaseForm';
import { API_USER_GROUPS } from './UserGroupsTable';

interface Props {
}

export default class UserGroupForm extends BaseForm<Props> {
  constructor(props: Props) {
    super(props);

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

  protected getApiName(): string {
    return API_USER_GROUPS;
  }

  protected getNewTitle(): string {
    return 'Uusi käyttäjäryhmä';
  }

  protected getEditTitle(): string {
    return 'Muokkaa käyttäjäryhmää';
  }

  protected getDeleteTitle(): string {
    return 'Poista käyttäjäryhmä';
  }
}
