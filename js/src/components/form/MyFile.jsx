import React from 'react';
import Form from 'react-bootstrap/Form'
import MyControl from './MyControl'

export default class MyFile extends MyControl {
  renderControl() {
    const { disabled, name, value, onChange } = this.props;

    return (
      <Form.File
        name={name}
        disabled={disabled}
        value={value}
        onChange={onChange}
      />
    );
  }
}
