import React from 'react';
import Form from 'react-bootstrap/Form'
import MyControl, { ControlProps } from './MyControl'

interface Props extends ControlProps {
  rows: number,
  value: string
}

export default class MyTextArea extends MyControl<Props> {
  protected renderControl(): JSX.Element {
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
