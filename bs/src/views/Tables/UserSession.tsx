import BaseTable from '../BaseTable';
import { USER_ROLES } from '../../services/authService';

const NAME = 'usersession';


export class UserSessionsTable extends BaseTable<{}> {
  constructor(props: any) {
    super(props);

    this.addId();
    this.addField('UserId',     'Käyttäjä No',        'number');
    this.addField('FirstName',  'Etunimi',            'text');
    this.addField('LastName',   'Sukunimi',           'text');
    this.addField('GroupName',  'Ruhmä',              'text');
    this.addField('Role',       'Rooli',              'number', { enums: USER_ROLES });
    this.addField('LoginTime',  'Sisäänkirjatuminen', 'datetime');
    this.addField('LogoutTime', 'Uloskirjautuminen',  'datetime');
    this.addField('IPAddress',  'IP-osoite',          'text',    { code: true });
  }

  protected getTitle(): string {
    return 'Kirjautumiset';
  }

  protected getApiName(): string {
    return NAME;
  }

  protected getModalForm(): any {
    return null;
  }
}
