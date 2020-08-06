import React from 'react';
import Form from 'react-bootstrap/Form'
import MyControl, { ControlProps } from './MyControl'
import { LookupPair } from '../common/Fields';

interface Props extends ControlProps {
  value: any,
  options?: LookupPair[],
  autofocus?: boolean,
  disabled?: boolean
}

export default class MySelect extends MyControl<Props> {
  protected renderControl(): JSX.Element {
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
