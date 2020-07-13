import React from 'react';
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

export default function MySelect({ asRow, error, label, name, options, value, onChange }) {
  
  function renderControl() {
    return (
      <>
        <Form.Control
          as="select"
          name={name}
          value={value}
          onChange={onChange}
        >
          {options.map(option => (
            <option
              key={option.Id}
              value={option.Id}
            >
              {option.Name}
            </option>
          ))}
        </Form.Control>
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
