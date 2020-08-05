import React, { Component } from 'react';
import ProblemRepliesTable from './ProblemRepliesTable';
import http from '../../services/httpService';
import { apiUrl } from '../../config.json';

export default class Replies extends Component {
  render() {
    const apiEndpoint = apiUrl + '/problemreplies';
    const { problemId } = this.props;
    
    return (
      <ProblemRepliesTable
        title="Vastaukset"
        newLink={'/problemreplies/new?ProblemId=' + problemId}
        getItems={async () => await http.get(apiEndpoint + '?ProblemId=' + problemId)}
        deleteItem={async item => await http.delete(apiEndpoint + '/' + item.Id)}
        showSearchBox={false}
        paginate={false}
        editable={true}
        deletable={true}
      />
    );
  }
}
