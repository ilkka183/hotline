import BaseTable from '../BaseTable';
import MakeForm from './MakeForm';

export default class MakesTable extends BaseTable<{}> {
  constructor(props: any) {
    super(props);

    this.addId(false);
    this.addName();
    this.addField('Info', 'Info', 'textarea');
    this.addEnabled();
  }

  protected getTitle(): string {
    return 'Automerkit';
  }

  protected getApiName(): string {
    return 'makes';
  }

  protected getForm(): any {
    return MakeForm;
  }
}
