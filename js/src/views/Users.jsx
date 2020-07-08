import React, { Component } from 'react';
import TableView from './TableView';
import UserSchema from '../schemas/UserSchema';

export default class Users extends Component {
  schema = new UserSchema();

  render() {
    return  <TableView schema={this.schema} />
  }
}
