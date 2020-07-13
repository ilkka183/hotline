import React from 'react';
import Form from 'react-bootstrap/Form'
import MyControl from './MyControl'

export default class MyInput extends MyControl {
  renderControl() {
    const { autofocus, disabled, name, type, value, onChange } = this.props;

    return (
      <Form.Control
        type={type}
        name={name}
        disabled={disabled}
        autoFocus={autofocus}
        value={value}
        onChange={onChange}
      />
    );
  }
}
