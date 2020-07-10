import React, { Component } from 'react';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import DataTable from '../components/common/DataTable';
import LinkButton from '../components/common/LinkButton';
import ProblemSchema from '../schemas/ProblemSchema';
import auth from '../services/authService';
import http from '../services/httpService';
import { apiUrl } from '../config.json';

export default class Home extends Component {
  user = auth.getCurrentUser();
  schema = new ProblemSchema();

  render() { 
    const editable = this.user !== null;
    const deletable = (this.user !== null) && (this.user.role <= 1);

    const buttonStyle = {
      marginBottom: 20
    }
  
    return (
      <Row>
        <Col>
          <h2>Avoimet vikatapaukset</h2>
          {editable && <LinkButton style={buttonStyle} to={`/problems/new`}>Uusi vikatapaus</LinkButton>}
          <DataTable
            schema={this.schema}
            showSearchBox={false}
            paginate={false}
            http={http}
            apiEndpoint={apiUrl + '/' + this.schema.pluralName}
            editable={editable}
            deletable={deletable}
          />
        </Col>
      </Row>
    );
  }
}
