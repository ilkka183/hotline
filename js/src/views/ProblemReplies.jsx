import React, { Component } from 'react';
import DataTable from '../components/common/DataTable';
import LinkButton from '../components/common/LinkButton';
import ProblemReplySchema from '../schemas/ProblemReplySchema';
import http from '../services/httpService';
import { apiUrl } from '../config.json';

export default class Replies extends Component {
  schema = new ProblemReplySchema();

  render() {
    const buttonStyle = {
      marginBottom: 20
    }

    const editable = true;
    const apiEndpoint = apiUrl + '/problemreplies';
    const { problemId } = this.props;
    
    return (
      <>
        <h2>Vastaukset</h2>
        {editable && <LinkButton style={buttonStyle} to={'/problemreplies/new?ProblemId=' + problemId}>Lisää uusi</LinkButton>}
        <DataTable
          schema={this.schema}
          getItems={async () => await http.get(apiEndpoint + '?ProblemId=' + problemId)}
          deleteItem={async item => await http.delete(apiEndpoint + '/' + item.Id)}
          showSearchBox={false}
          paginate={false}
          editable={editable}
          deletable={true}
        />
      </>
    );
  }
}
