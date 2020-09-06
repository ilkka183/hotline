import React from 'react';
import Form from 'react-bootstrap/Form'
import MyAutoFocusControl, { AutoFocusControlProps } from './MyAutoFocusControl'
import { LookupPair } from '../common/Fields';

interface Props extends AutoFocusControlProps {
  value: any,
  options?: LookupPair[],
  disabled?: boolean
}

export default class MySelect extends MyAutoFocusControl<Props> {
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
