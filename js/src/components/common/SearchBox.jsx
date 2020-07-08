import React from 'react';
import Form from 'react-bootstrap/Form'

export default function SearchBox({ value, onChange }) {
  return (
    <Form>
      <Form.Group>
        <Form.Control
          type="text"
          placeholder="Etsi..."
          value={value}
          onChange={e => onChange(e.currentTarget.value)}
        />
      </Form.Group>
    </Form>
  );
}
