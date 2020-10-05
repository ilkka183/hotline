import { Field } from '../components/common/Fields';
import DataForm from '../components/common/DataForm';
import auth, { User } from '../services/authService';
import http from '../services/httpService';

export default abstract class BaseForm<P> extends DataForm<P> {
  protected readonly user: User | null = auth.getCurrentUser();

  public get hasPowerRights(): boolean {
    return (this.user !== null) && this.user.isPowerOrAdmin;
  }

  public getHttp(): any {
    return http;
  }

  public addId(visible: boolean = true): Field {
    return this.addField('Id', 'No', 'number',  { primaryKey: true, readonly: true, visible });
  }

  public addEnabled(): Field {
    return this.addField('Enabled', 'Voimassa', 'boolean', { required: true, getDefaultValue: () => true });
  }

  public addTimestamps() {
    this.addField('CreatedAt', 'Luotu',    'datetime', { required: true, readonly: true });
    this.addField('UpdatedAt', 'Muokattu', 'datetime', { readonly: true });
  }
}
