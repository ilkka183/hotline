import DataForm from './DataForm';
import { BaseSchema } from '../schemas/BaseSchema';


class UserGroupSchema extends BaseSchema {
  constructor() {
    super('usergroups', 'Käyttäjäryhmä');

    this.addField('Id',            'No',               'number', { required: true, readonly: true, primaryKey: true, visible: false });
    this.addField('Name',          'Nimi',             'text',   { required: true, editLink: true });
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
