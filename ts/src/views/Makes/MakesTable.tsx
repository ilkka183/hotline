import BaseTable from '../BaseTable';
import MakeForm from './MakeForm';

export const API_MAKES = 'makes';

interface Props {
}

export default class MakesTable extends BaseTable<Props> {
  constructor(props: any) {
    super(props);

    this.addId(true);
    this.addName();
    this.addField('Info', 'Info', 'textarea');
    this.addEnabled();
  }

  protected getTitle(): string {
    return 'Automerkit';
  }

  protected getApiName(): string {
    return API_MAKES;
  }

  protected getModalForm(): any {
    return MakeForm;
  }
}
