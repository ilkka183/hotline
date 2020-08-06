import React from 'react';
import Form from 'react-bootstrap/Form'
import MyControl, { ControlProps } from './MyControl'

interface Props extends ControlProps {
  value: boolean
}

export default class MyCheck extends MyControl<Props> {
  protected renderLabel(): JSX.Element | null {
    return null
  }

  protected renderControl(): JSX.Element {
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
