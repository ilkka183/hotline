import BaseTable from '../BaseTable';

export default class BrandsTable extends BaseTable {
  constructor() {
    super();

    this.addId();
    this.addName();
    this.addField('Info', 'Info', 'textarea');
    this.addEnabled();
  }

  getTitle() {
    return 'Automerkit';
  }

  getApiName() {
    return 'brands';
  }
}
