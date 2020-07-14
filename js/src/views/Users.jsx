import React, { Component } from 'react';
import TableView from './TableView';
import { BaseSchema, USER_ROLES } from '../schemas/BaseSchema';


class UserSchema extends BaseSchema {
  constructor() {
    super('users', 'Käyttäjät');

    this.addField('Id',           'No',               'number', { visible: false });
    this.addField('FirstName',    'Etunimi',          'text',   { editLink: true });
    this.addField('LastName',     'Sukunimi',         'text',   { editLink: true });
    this.addField('Role',         'Rooli',            'number', { enums: USER_ROLES });
    this.addField('GroupName',    'Ryhmä',            'text');
    this.addField('Title',        'Toimenkuva',       'text');
    this.addField('Address',      'Osoite',           'text');
    this.addField('PostalCode',   'Postinumero',      'text');
    this.addField('PostOffice',   'Postitoimipaikka', 'text');
    this.addField('Country',      'Maa',              'text');
    this.addField('LicenseBegin', 'Lisenssi alku',    'date');
    this.addField('LicenseEnd',   'Lisenssi loppu',   'date');
    this.addEnabled();
  }
}


export default class Users extends Component {
  schema = new UserSchema();

  render() {
    return <TableView schema={this.schema} />
  }
}
