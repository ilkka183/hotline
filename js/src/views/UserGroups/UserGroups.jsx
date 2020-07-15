import React, { Component } from 'react';
import UserGroupsTable from './UserGroupsTable';
import http from '../../services/httpService';
import { apiUrl } from '../../config.json';

export default class UserGroups extends Component {
  render() {
    const apiEndpoint = apiUrl + '/usergroups';

    return (
      <UserGroupsTable
        title="Käyttäjäryhmät"
        getItems={async () => await http.get(apiEndpoint)}
        deleteItem={async item => await http.delete(apiEndpoint + '/' + item.Id)}
        editable={true}
        deletable={true}
      />
    );
  }
}
