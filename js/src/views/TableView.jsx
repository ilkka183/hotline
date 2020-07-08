import React from 'react';
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import DataTable from '../components/common/DataTable';
import LinkButton from '../components/common/LinkButton';
import auth from '../services/authService';
import http from '../services/httpService';
import { apiUrl } from '../config.json';

export default function TableView({ schema }) {
  const user = auth.getCurrentUser();
  const editable = user !== null;
  const deletable = (user !== null) && (user.role <= 1);

  return (
    <Container fluid>
      <Row>
        <Col>
          <h1>{schema.pluralTitle}</h1>
          {editable && <LinkButton style={{ marginBottom: 20 }} to={`/${schema.pluralName}/new`}>Uusi tietue</LinkButton>}
          <DataTable
            schema={schema}
            http={http}
            apiEndpoint={apiUrl + '/' + schema.pluralName}
            editable={editable}
            deletable={deletable}
          />
        </Col>
      </Row>
    </Container>
  );
}
