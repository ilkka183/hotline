import React, { Component } from 'react';
import DataTable from '../../components/common/DataTable';
import LinkButton from '../../components/common/LinkButton';
import { TableSchema } from '../../schemas/Schemas';
import http from '../../services/httpService';
import { apiUrl } from '../../config.json';


class ProblemRepliesSchema extends TableSchema {
  constructor(props) {
    super('problemreplies', 'Vastaus');

    this.addField('Id',        'No',         'number',   { visible: false });
    this.addField('ProblemId', 'Vikatapaus', 'number',   { visible: false });
    this.addField('Date',      'Pvm',        'datetime', { displayFormat: 'date' });
    this.addField('UserName',  'Lähettäjä',  'text');
    this.addField('Message',   'Viesti',     'textarea', { editLink: true, rows: 5 });
    this.addField('Solution',  'Ratkaisu',   'boolean');
  }
}


export default class Replies extends Component {
  schema = new ProblemRepliesSchema();

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
