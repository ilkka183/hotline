import React, { Component } from 'react';
import TableView from './TableView';
import { ProblemsSchema } from '../schemas/ProblemsSchema';


export default class Problems extends Component {
  schema = new ProblemsSchema();

  render() {
    return <TableView schema={this.schema} />
  }
}
