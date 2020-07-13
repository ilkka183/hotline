import React from 'react';
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

export default function MyCheck({ asRow, name, label, value, error, onChange }) {

  function renderControl() {
    return (
      <>
        <Form.Check
          type="checkbox"
          label={label}
          name={name}
          checked={value}
          onChange={onChange}
        />
        {error && <Alert variant="danger">{error}</Alert>}
      </>
    );
  }

  if (asRow) {
    return (
      <Form.Group as={Row} controlId={name}>
        <Form.Label column sm="2"></Form.Label>
        <Col sm="10">
          {renderControl()}
        </Col>
      </Form.Group>
    );
  }

  return (
    <Form.Group controlId={name}>
      {renderControl()}
    </Form.Group>
  );
}
