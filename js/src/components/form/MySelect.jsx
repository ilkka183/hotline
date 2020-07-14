import React from 'react';
import Form from 'react-bootstrap/Form'
import MyControl from './MyControl'

export default class MySelect extends MyControl {
  renderControl() {
    const { disabled, name, options, value, onChange } = this.props;

    return (
      <Form.Control
        as="select"
        name={name}
        disabled={disabled}
        value={value}
        onChange={onChange}
      >
        {options && options.map(option => (
          <option
            key={option.Id}
            value={option.Id}
          >
            {option.Name}
          </option>
        ))}
      </Form.Control>
    );
  }
}
