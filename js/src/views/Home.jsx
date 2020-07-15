import React, { Component } from 'react';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ProblemsTable from './Problems/ProblemsTable';
import auth from '../services/authService';
import http from '../services/httpService';
import { apiUrl } from '../config.json';


export default class Home extends Component {
  render() { 
    const user = auth.getCurrentUser();
    const editable = user !== null;
    const deletable = (user !== null) && (user.role <= 1);

    if (!user)
      return null;

    const apiEndpoint = apiUrl + '/problems';
  
    return (
      <>
        <Row>
          <Col>
            <ProblemsTable
              title="Avoimet vikatapaukset"
              newLink="/problems/create"
              showSearchBox={false}
              paginate={false}
              getItems={async () => await http.get(apiEndpoint + '?Status=0')}
              deleteItem={async item => await http.delete(apiEndpoint + '/' + item.Id)}
              editable={editable}
              deletable={deletable}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <ProblemsTable
              title="Viimeksi ratkaistut vikatapaukset"
              showSearchBox={false}
              paginate={false}
              getItems={async () => await http.get(apiEndpoint + '?Status=1')}
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
