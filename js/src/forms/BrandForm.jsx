import DataForm from './DataForm';
import { BaseSchema } from '../schemas/BaseSchema';


class BrandSchema extends BaseSchema {
  constructor() {
    super('brands', 'Automerkki');

    this.addField('Id',   'No',   'number',   { required: true, readonly: true, primaryKey: true, visible: false });
    this.addField('Name', 'Nimi', 'text',     { required: true });
    this.addField('Info', 'Info', 'textarea', { rows: 5 });
    this.addEnabled();
    this.addTimestamps();
  }
}


export default class BrandForm extends DataForm {
  schema = new BrandSchema();

  state = {
    data: this.schema.emptyData(),
    errors: {}
  }
}
