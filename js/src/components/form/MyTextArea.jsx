import React from 'react';
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

export default function MyTextArea({ asRow, error, label, name, rows, value, onChange }) {

  function renderControl() {
    return (
      <>
        <Form.Control
          as="textarea"
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
        />
        {error && <Alert variant="danger">{error}</Alert>}
      </>
    );
  }

  if (asRow) {
    return (
      <Form.Group as={Row} controlId={name}>
        <Form.Label column sm="2">{label}</Form.Label>
        <Col sm="10">
          {renderControl()}
        </Col>
      </Form.Group>
    );
  }

  return (
    <Form.Group controlId={name}>
      <Form.Label>{label}</Form.Label>
      {renderControl()}
    </Form.Group>
  );
}
