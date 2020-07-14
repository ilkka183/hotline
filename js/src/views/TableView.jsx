import React from 'react';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import DataTable from '../components/common/DataTable';
import LinkButton from '../components/common/LinkButton';
import auth from '../services/authService';
import http from '../services/httpService';
import { apiUrl } from '../config.json';

export default function TableView({ schema, showSearchBox, paginate }) {
  const user = auth.getCurrentUser();
  const editable = user !== null;
  const deletable = (user !== null) && (user.role <= 1);

  const buttonStyle = {
    marginBottom: 20
  }

  const apiEndpoint = apiUrl + '/' + schema.pluralName;

  return (
    <Row>
      <Col>
        <h2>{schema.pluralTitle}</h2>
        {editable && <LinkButton style={buttonStyle} to={`/${schema.pluralName}/new`}>Lisää uusi</LinkButton>}
        <DataTable
          schema={schema}
          getItems={async () => await http.get(apiEndpoint)}
          deleteItem={async item => await http.delete(apiEndpoint + '/' + item.Id)}
          showSearchBox={showSearchBox}
          paginate={paginate}
          editable={editable}
          deletable={deletable}
        />
      </Col>
    </Row>
  );
}
