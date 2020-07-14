import DataForm from '../DataForm';
import { FormSchema } from '../../schemas/Schemas';


class BrandSchema extends FormSchema {
  constructor() {
    super('brands', 'Automerkki');

    this.addId();
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
