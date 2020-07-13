import React, { Component } from 'react';
import DataTable from '../components/common/DataTable';
import LinkButton from '../components/common/LinkButton';
import ProblemReplySchema from '../schemas/ProblemReplySchema';
import http from '../services/httpService';
import { apiUrl } from '../config.json';

export default class Replies extends Component {
  schema = new ProblemReplySchema();

  render() {
    const editable = true;
    const apiEndpoint = apiUrl + '/problemreplies/problem/' + this.props.problemId;

    const buttonStyle = {
      marginBottom: 20
    }

    return (
      <>
        <h2>Vastaukset</h2>
        {editable && <LinkButton style={buttonStyle} to={`/problemreplies/new`}>Lisää uusi</LinkButton>}
        <DataTable
          schema={this.schema}
          http={http}
          apiEndpoint={apiEndpoint}
          showSearchBox={false}
          paginate={false}
          editable={editable}
          deletable={true}
        />
      </>
    );
  }
}
