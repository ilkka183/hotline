import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ProblemsTable from './Problems/ProblemsTable';
import auth from '../services/authService';


export default class Home extends Component {
  render() { 
    const user = auth.getCurrentUser();

    const editable = true;
    const deletable = user && user.role <= 1;

    if (!user)
      return null;

    return (
      <>
        <Row>
          <Col>
            <ProblemsTable
              title="Avoimet vikatapaukset"
              status={0}
              showSearchBox={true}
              paginate={false}
              creatable={false}
              editable={editable}
              deletable={deletable}
            />
            <Link to="/problems/new">Lisää uusi vikatapaus</Link>
          </Col>
        </Row>
        <Row>
          <Col>
            <ProblemsTable
              title="Viimeksi ratkaistut vikatapaukset"
              status={1}
              showSearchBox={false}
              paginate={false}
              creatable={false}
              editable={editable}
              deletable={deletable}
            />
          </Col>
        </Row>
      </>
    );
  }
}
