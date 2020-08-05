import React from 'react';
import Form from 'react-bootstrap/Form'
import MyControl from './MyControl'

export default class MyTextArea extends MyControl {
  renderControl() {
    const { name, rows, value, onChange } = this.props;

    return (
      <Form.Control
        as="textarea"
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
      />
    );
  }
}
