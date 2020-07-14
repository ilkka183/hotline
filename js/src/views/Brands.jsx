import React, { Component } from 'react';
import TableView from './TableView';
import { BaseSchema } from '../schemas/BaseSchema';


class BrandSchema extends BaseSchema {
  constructor() {
    super('brands', 'Automerkit');

    this.addField('Id',   'No',   'number',   { visible: false });
    this.addField('Name', 'Nimi', 'text',     { editLink: true });
    this.addField('Info', 'Info', 'textarea');
    this.addEnabled();
    this.addTimestamps();
  }
}


export default class Brands extends Component {
  schema = new BrandSchema();

  render() {
    return <TableView schema={this.schema} />
  }
}
