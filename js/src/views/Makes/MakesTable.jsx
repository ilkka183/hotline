import BaseTable from '../BaseTable';

export default class MakesTable extends BaseTable {
  constructor() {
    super();

    this.addId(false);
    this.addName();
    this.addField('Info', 'Info', 'textarea');
    this.addEnabled();
  }

  getTitle() {
    return 'Automerkit';
  }

  getApiName() {
    return 'makes';
  }
}
