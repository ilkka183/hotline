import React from 'react';
import Form from 'react-bootstrap/Form'

interface Props {
  name: string,
  placeholder: string,
  value: any,
  options: any[],
  onChange: (event: any) => void
}

const FieldSelect: React.FC<Props> = ({ name, placeholder, value, options, onChange }) => {
  return (
    <Form.Control
      as="select"
      className="mb-2 mr-sm-2"
      name={name}
      value={value}
      onChange={onChange}
    >
      <option value={undefined}>{placeholder}</option>
      {options && options.map((option, index) => <option key={index} value={option.value}>{option.text}</option>)}
    </Form.Control>
  );
}

export default FieldSelect;
