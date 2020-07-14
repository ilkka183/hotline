import React, { Component } from 'react';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import DataTable from '../components/common/DataTable';
import LinkButton from '../components/common/LinkButton';
import { ProblemsSchema } from '../schemas/ProblemsSchema';
import auth from '../services/authService';
import http from '../services/httpService';
import { apiUrl } from '../config.json';


export default class Home extends Component {
  user = auth.getCurrentUser();
  schema = new ProblemsSchema();

  render() { 
    const editable = this.user !== null;
    const deletable = (this.user !== null) && (this.user.role <= 1);

    const buttonStyle = {
      marginBottom: 20
    }

    if (!this.user)
      return null;

    const apiEndpoint = apiUrl + '/' + this.schema.api;
  
    return (
      <>
        <Row>
          <Col>
            <h2>Avoimet vikatapaukset</h2>
            {editable && <LinkButton style={buttonStyle} to={`/problems/create`}>Lisää uusi</LinkButton>}
            <DataTable
              schema={this.schema}
              showSearchBox={false}
              paginate={false}
              getItems={async () => await http.get(apiEndpoint)}
              deleteItem={async item => await http.delete(apiEndpoint + '/' + item.Id)}
              editable={editable}
              deletable={deletable}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Viimeksi ratkaistut vikatapaukset</h2>
            <DataTable
              schema={this.schema}
              showSearchBox={false}
              paginate={false}
              getItems={async () => await http.get(apiEndpoint)}
              deleteItem={async item => await http.delete(apiEndpoint + '/' + item.Id)}
              editable={editable}
              deletable={deletable}
            />
          </Col>
        </Row>
      </>
    );
  }
}
