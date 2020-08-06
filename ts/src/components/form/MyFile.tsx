import React from 'react';
import Form from 'react-bootstrap/Form'
import MyControl, { ControlProps } from './MyControl'

interface Props extends ControlProps {
  disabled: boolean,
  value: string
}

export default class MyFile extends MyControl<Props> {
  protected renderControl(): JSX.Element {
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
