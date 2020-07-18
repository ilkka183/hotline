import React from 'react';
import Form from 'react-bootstrap/Form'

export default function FieldSelect({ name, placeholder, value, options, onChange }) {
  return (
    <Form.Control
      as="select"
      className="mb-2 mr-sm-2"
      name={name}
      value={value}
      onChange={onChange}
    >
      <option value={null}>{placeholder}</option>
      {options && options.map((option, index) => <option key={index} value={option.value}>{option.text}</option>)}
    </Form.Control>
  );
}
