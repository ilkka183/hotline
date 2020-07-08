import React, { Component } from 'react';
import TableView from './TableView';
import UserGroupSchema from '../schemas/UserGroupSchema';

export default class UserGroups extends Component {
  schema = new UserGroupSchema();

  render() {
    return  <TableView schema={this.schema} />
  }
}
