import React from 'react';
import Col from 'react-bootstrap/Col'
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

  const buttonStyle = {
    marginBottom: 20
  }

  return (
    <Row>
      <Col>
        <h2>{schema.pluralTitle}</h2>
        {editable && <LinkButton style={buttonStyle} to={`/${schema.pluralName}/new`}>Uusi tietue</LinkButton>}
        <DataTable
          schema={schema}
          http={http}
          apiEndpoint={apiUrl + '/' + schema.pluralName}
          editable={editable}
          deletable={deletable}
        />
      </Col>
    </Row>
  );
}
