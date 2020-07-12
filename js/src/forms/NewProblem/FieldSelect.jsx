import React from 'react';
import Form from 'react-bootstrap/Form'

export default function FieldSelect({ name, placeholder, value, values, onChange }) {
  return (
    <Form.Control
      as="select"
      className="mb-2 mr-sm-2"
      name={name}
      value={value}
      onChange={onChange}
    >
      <option value={''}>{placeholder}</option>
      {values.map(item => <option key={item} value={name}>{item}</option>)}
    </Form.Control>
  );
}
