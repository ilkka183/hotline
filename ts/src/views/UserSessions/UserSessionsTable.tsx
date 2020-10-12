import BaseTable from '../BaseTable';

export const API_USER_SESSIONS = 'usersessions';

interface Props {
}

export default class UserSessionsTable extends BaseTable<Props> {
  constructor(props: Props) {
    super(props);

    this.addId();
    this.addField('UserId',     'Käyttäjä No',        'number');
    this.addField('FirstName',  'Etunimi',            'text');
    this.addField('LastName',   'Sukunimi',           'text');
    this.addField('LoginTime',  'Sisäänkirjatuminen', 'datetime');
    this.addField('LogoutTime', 'Uloskirjautuminen',  'datetime');
    this.addField('IPAddress',  'IP-osoite',          'text',    { code: true });
  }

  protected getTitle(): string {
    return 'Kirjautumiset';
  }

  protected getApiName(): string {
    return API_USER_SESSIONS;
  }

  protected getModalForm(): any {
    return undefined;
  }
}
