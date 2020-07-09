import React, { Component } from 'react';
import TableView from './TableView';
import ProblemSchema from '../schemas/ProblemSchema';

export default class Problems extends Component {
  schema = new ProblemSchema();

  render() {
    return <TableView schema={this.schema} />
  }
}
