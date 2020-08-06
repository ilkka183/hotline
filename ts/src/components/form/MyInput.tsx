import React from 'react';
import Form from 'react-bootstrap/Form'
import MyControl, { ControlProps } from './MyControl'

interface Props extends ControlProps {
  type: string,
  value: string,
  autofocus?: boolean,
  disabled?: boolean
}

export default class MyInput extends MyControl<Props> {
  protected renderControl(): JSX.Element {
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
