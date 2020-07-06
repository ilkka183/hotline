import React from 'react';
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import DataTable from '../components/common/DataTable';
import LinkButton from '../components/common/LinkButton';
import auth from '../services/authService';
import http from '../services/httpService';
import { apiUrl } from '../config.json';

export default function TableView({ title, columns, restName }) {
  const user = auth.getCurrentUser();

  return (
    <Container>
      <Row>
        <Col>
          <h1>{title}</h1>
          {user && <LinkButton style={{ marginBottom: 20 }} to={`/${restName}/new`}>New Item</LinkButton>}
          <DataTable
            columns={columns}
            http={http}
            apiEndpoint={apiUrl + '/' + restName}
          />
        </Col>
      </Row>
    </Container>
  );
}
