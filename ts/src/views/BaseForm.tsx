import { Field } from '../components/common/Fields';
import DataForm from '../components/common/DataForm';
import auth, { User, UserRole } from '../services/authService';
import http from '../services/httpService';

const SHOW_IDS = true;

export default abstract class BaseForm<P> extends DataForm<P> {
  protected user: any = auth.getCurrentUser();

  public get hasPowerRights(): boolean {
    return this.user.role <= UserRole.Power;
  }

  public getHttp(): any {
    return http;
  }

  public addId(visible: boolean = SHOW_IDS): Field {
    return this.addField('Id', 'No', 'number',  { primaryKey: true, readonly: true, visible });
  }

  public addEnabled(): Field {
    return this.addField('Enabled', 'Voimassa', 'boolean', { required: true, getDefaultValue: () => true });
  }

  public addTimestamps(): void {
    this.addField('CreatedAt', 'Luotu',    'datetime', { required: true, readonly: true });
    this.addField('UpdatedAt', 'Muokattu', 'datetime', { readonly: true });
  }

  afterSubmit() {
    const { onSubmitted } = this.props;

    if (onSubmitted)
      onSubmitted();

    this.goBack();
  }
}
