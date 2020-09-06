import BaseForm from '../BaseForm';
import { API_MAKES } from './MakesTable';

export default class MakeForm extends BaseForm<{}> {
  constructor(props: any) {
    super(props);

    this.addId();
    this.addField('Name', 'Nimi', 'text',     { required: true });
    this.addField('Info', 'Info', 'textarea', { rows: 5 });
    this.addEnabled();
    this.addTimestamps();
    
    this.state.data = this.getEmptyData();
  }

  protected getApiName(): string {
    return API_MAKES;
  }

  protected getNewTitle(): string {
    return 'Uusi automerkki';
  }

  protected getEditTitle(): string {
    return 'Muokkaa automerkkiä';
  }

  protected getDeleteTitle(): string {
    return 'Poistetaanko automerkki?';
  }
}
