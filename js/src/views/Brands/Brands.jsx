import React, { Component } from 'react';
import BrandsTable from './BrandsTable';
import http from '../../services/httpService';
import { apiUrl } from '../../config.json';

export default class Brands extends Component {
  render() {
    const apiEndpoint = apiUrl + '/brands';

    return (
      <BrandsTable
        title="Automerkit"
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
