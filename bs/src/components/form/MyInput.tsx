import React from 'react';
import Form from 'react-bootstrap/Form'
import MyAutoFocusControl, { AutoFocusControlProps } from './MyAutoFocusControl'

interface Props extends AutoFocusControlProps {
  type: string,
  value: string,
  disabled?: boolean
}

export default class MyInput extends MyAutoFocusControl<Props> {
  protected renderControl(): JSX.Element {
    const { autofocus, disabled, name, type, value, onChange } = this.props;

    return (
      <Form.Control
        ref={this.innerRef}
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
