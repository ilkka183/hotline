import React from 'react';
import Form from 'react-bootstrap/Form'
import MyControl from './MyControl'

export default class MyCheck extends MyControl {
  renderLabel() {
    return null
  }

  renderControl() {
    const { label, name, value, onChange } = this.props;

    return (
      <Form.Check
        type="checkbox"
        label={label}
        name={name}
        checked={value}
        onChange={onChange}
      />
    );
  }
}
