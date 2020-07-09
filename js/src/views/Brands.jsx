import React, { Component } from 'react';
import TableView from './TableView';
import BrandSchema from '../schemas/BrandSchema';

export default class Brands extends Component {
  schema = new BrandSchema();

  render() {
    return <TableView schema={this.schema} />
  }
}
