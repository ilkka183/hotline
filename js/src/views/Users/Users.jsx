import React, { Component } from 'react';
import UsersTable from './UsersTable';
import http from '../../services/httpService';
import { apiUrl } from '../../config.json';

export default class Users extends Component {
  render() {
    const apiEndpoint = apiUrl + '/users';

    return (
      <UsersTable
        title="Käyttäjät"
        getItems={async () => await http.get(apiEndpoint)}
        deleteItem={async item => await http.delete(apiEndpoint + '/' + item.Id)}
        showSearchBox={true}
        paginate={true}
        editable={true}
        deletable={true}
      />
    );
  }
}
