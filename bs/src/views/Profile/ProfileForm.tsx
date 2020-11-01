import BaseForm from '../BaseForm';

interface Props {
  userId?: number
}

export default class ProfileForm extends BaseForm<Props> {
  constructor(props: Props) {
    super(props);
    
    this.addId();
    this.addField('FirstName',    'Etunimi',          'text',   { required: true, readonly: true });
    this.addField('LastName',     'Sukunimi',         'text',   { required: true, readonly: true });
    this.addField('GroupId',      'Ryhmä',            'number', { required: true, readonly: true, lookupUrl: 'UserGroups' });
    this.addField('Role',         'Rooli',            'number', { required: true, readonly: true, enums: ['pääkäyttäjä', 'tehokäyttäjä', 'käyttäjä', 'demokäyttäjä'] });
    this.addField('Email',        'Sähköposti',       'email',  { required: true });
    this.addField('BusinessId',   'Y-tunnus',         'text');
    this.addField('Title',        'Toimenkuva',       'text');
    this.addField('Address',      'Osoite',           'text');
    this.addField('PostalCode',   'Postinumero',      'text');
    this.addField('PostOffice',   'Postitoimipaikka', 'text');
    this.addField('Country',      'Maa',              'text');
    this.addField('Phone',        'Puhelin',          'phone');
    this.addField('MaxOpenQuestionCount', 'Avoimia vikatapauksia enintään', 'number',   { readonly: true });
    this.addField('LicenseBegin',         'Lisenssi alku',                  'date',     { readonly: true });
    this.addField('LicenseEnd',           'Lisenssi loppu',                 'date',     { readonly: true });
    this.addField('LastLogin',            'Viimeinen sisäänkirjautuminen',  'datetime', { readonly: true });
    this.addField('LastLogout',           'Viimeinen uloskirjautuminen',    'datetime', { readonly: true });

    this.state.data = this.getEmptyData();
  }

  protected getApiName(): string {
    return 'users';
  }

  protected getInsertTitle(): string {
    return 'Lisää oma tieto';
  }

  protected getUpdateTitle(): string {
    return 'Muokkaa omia tietoja';
  }

  protected getDeleteTitle(): string {
    return 'Poista oma tieto';
  }

  protected getDataId(): number | undefined {
    return this.props.userId;
  }
}
