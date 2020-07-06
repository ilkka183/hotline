import React, { Component } from 'react';
import TableView from './TableView';
import MovieSchema from '../schemas/MovieSchema';

export default class Movies extends Component {
  schema = new MovieSchema();

  render() {
    return  <TableView schema={this.schema} />
  }
}
