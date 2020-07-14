import React, { Component } from 'react';
import TableView from './TableView';
import { TableSchema } from '../schemas/Schemas';


class UserGroupsSchema extends TableSchema {
  constructor() {
    super('usergroups', 'Käyttäjäryhmät');

    this.addField('Id',            'No',               'number', { visible: false });
    this.addField('Name',          'Nimi',             'text',   { editLink: true });
    this.addField('ContactPerson', 'Yhteyshenkilö',    'text');
    this.addField('Address',       'Osoite',           'text');
    this.addField('PostalCode',    'Postinumero',      'text');
    this.addField('PostOffice',    'Postitoimipaikka', 'text');
    this.addField('Country',       'Maa',              'text');
    this.addField('Phone',         'Puhelin',          'phone');
    this.addField('Email',         'Sähköposti',       'email');
    this.addField('Website',       'Nettisivut',       'text');
    this.addEnabled();
  }
}


export default class UserGroups extends Component {
  schema = new UserGroupsSchema();

  render() {
    return <TableView schema={this.schema} />
  }
}
