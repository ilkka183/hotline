import React, { Component } from 'react';
import ProblemsTable from './ProblemsTable';
import http from '../../services/httpService';
import { apiUrl } from '../../config.json';

export default class Problems extends Component {
  render() {
    const apiEndpoint = apiUrl + '/problems';

    return (
      <ProblemsTable
        title="Vikatapaukset"
        getItems={async () => await http.get(apiEndpoint)}
        deleteItem={async item => await http.delete(apiEndpoint + '/' + item.Id)}
        showSearchBox={false}
        paginate={false}
        editable={true}
        deletable={true}
      />
    );
  }
}
