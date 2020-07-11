import React from 'react';
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

export default function MyPlainText({ name, label, value, error, onChange }) {
  return (
    <Form.Group as={Row} controlId={name}>
      <Form.Label column sm="2">{label}:</Form.Label>
      <Col sm="10">
        <Form.Control
          plaintext
          readOnly
          name={name}
          value={value}
          onChange={onChange}
        />
        {error && <Alert variant="danger">{error}</Alert>}
      </Col>
    </Form.Group>
  );
}
