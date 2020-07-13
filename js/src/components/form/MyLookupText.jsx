import React from 'react';
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

export default function MyLookupText({ asRow, error, name, label, options, value }) {

  function lookupText(id) {
    if (options) {
      for (let item of options)
        if (item.Id === id)
          return item.Name;
    }

    return null;
  }

  const text = lookupText(value);

  function renderControl() {
    return (
      <>
        <Form.Control
          readOnly
          name={name}
          defaultValue={text}
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
