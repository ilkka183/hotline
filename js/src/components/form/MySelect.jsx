import React from 'react';
import Form from 'react-bootstrap/Form'
import MyControl from './MyControl'

export default class MySelect extends MyControl {
  renderControl() {
    const { autofocus, disabled, name, options, value, onChange } = this.props;

    return (
      <Form.Control
        as="select"
        name={name}
        disabled={disabled}
        autoFocus={autofocus}
        value={value}
        onChange={onChange}
      >
        {options && options.map(option => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.text}
          </option>
        ))}
      </Form.Control>
    );
  }
}
