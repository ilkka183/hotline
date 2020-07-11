import React from 'react';
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

export default function MySelect({ error, label, name, options, readonly, value, onChange }) {
  return (
    <Form.Group as={Row} controlId={name}>
      <Form.Label column sm="2">{label}:</Form.Label>
      <Col sm="10">
        <Form.Control
          as="select"
          name={name}
          readOnly={readonly}
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
      </Col>
    </Form.Group>
  );
}
