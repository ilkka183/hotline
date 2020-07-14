import DataForm from './DataForm';
import { FormSchema } from '../schemas/Schemas';


class UserGroupSchema extends FormSchema {
  constructor() {
    super('usergroups', 'Käyttäjäryhmä');

    this.addId();
    this.addField('Name',          'Nimi',             'text',   { required: true });
    this.addField('ContactPerson', 'Yhteyshenkilö',    'text');
    this.addField('Address',       'Osoite',           'text');
    this.addField('PostalCode',    'Postinumero',      'text');
    this.addField('PostOffice',    'Postitoimipaikka', 'text');
    this.addField('Country',       'Maa',              'text');
    this.addField('Phone',         'Puhelin',          'phone');
    this.addField('Email',         'Sähköposti',       'email');
    this.addField('Website',       'Nettisivut',       'text');
    this.addEnabled();
    this.addTimestamps();
  }
}


export default class UserGroupForm extends DataForm {
  schema = new UserGroupSchema();

  state = {
    data: this.schema.emptyData(),
    errors: {}
  }
}
