import React, { Component } from 'react';
import TableView from './TableView';
import { TableSchema } from '../schemas/Schemas';


class BrandsSchema extends TableSchema {
  constructor() {
    super('brands', 'Automerkit');

    this.addField('Id',   'No',   'number',   { visible: false });
    this.addField('Name', 'Nimi', 'text',     { editLink: true });
    this.addField('Info', 'Info', 'textarea');
    this.addEnabled();
  }
}


export default class Brands extends Component {
  schema = new BrandsSchema();

  render() {
    return <TableView schema={this.schema} />
  }
}
