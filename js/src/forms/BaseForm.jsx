import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import MyCheck from '../components/form/MyCheck';
import MyInput from '../components/form/MyInput';
import MySelect from '../components/form/MySelect';
import MyTextArea from '../components/form/MyTextArea';

export default class BaseForm extends Component {
  state = {
    data: {},
    errors: {}
  }

  validate() {
    const errors = {}

    for (const field of this.schema.fields) {
      const value = this.state.data[field.name];

      if (!field.hasFormControl(value))
        continue;

      const error = field.validate(value);

      if (error) {
        errors[field.name] = error;
        break;
      }
    }

    return Object.keys(errors).length === 0 ? null : errors;
  }

  validateProperty({ name, value }) {
    const field = this.schema.findField(name);
    return field && field.validate(value);
  }

  handleSubmit = e => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors)
      return;

    this.doSubmit();
  }

  handleChange = ({ currentTarget: input }) => {
    const errors = {...this.state.errors}
    const errorMessage = this.validateProperty(input);

    if (errorMessage)
      errors[input.name] = errorMessage;
    else
      delete errors[input.name];

    const data = {...this.state.data}

    if (input.type === 'checkbox')
      data[input.name] = input.checked;
    else
      data[input.name] = input.value;

    this.setState({ data, errors });
  }

  renderTitle(text) {
    return <h2>{text}</h2>
  }

  get asRow() {
    return true;
  }

  renderInput(field, autofocus = false) {
    const { name, label, readonly, required, type } = field;
    const { data, errors } = this.state;

    return (
      <MyInput
        asRow={this.asRow}
        key={name}
        name={name}
        type={type}
        label={label}
        required={required}
        disabled={readonly}
        autofocus={autofocus}
        value={data[name]}
        error={errors[name]}
        onChange={this.handleChange}
      />
    );
  }

  renderTextArea(field) {
    const { name, label, required, rows } = field;
    const { data, errors } = this.state;

    return (
      <MyTextArea
        asRow={this.asRow}
        key={name}
        name={name}
        label={label}
        required={required}
        rows={rows}
        value={data[name]}
        error={errors[name]}
        onChange={this.handleChange}
      />
    );
  }

  renderSelect(field) {
    const { name, label, lookup, readonly, required } = field;
    const { data, errors } = this.state;

    return (
      <MySelect
        asRow={this.asRow}
        key={name}
        name={name}
        label={label}
        required={required}
        options={lookup}
        disabled={readonly}
        value={data[name]}
        error={errors[name]}
        onChange={this.handleChange}
      />
    );
  }

  renderCheck(field) {
    const { name, label } = field;
    const { data, errors } = this.state;

    return (
      <MyCheck
        asRow={this.asRow}
        key={name}
        name={name}
        label={label}
        value={data[name]}
        error={errors[name]}
        onChange={this.handleChange}
      />
    );
  }

  renderSubmitButton(label) {
    return (
      <Button
        variant="primary"
        type="submit"
        disabled={this.validate() && false}
      >
        {label}
      </Button>
    );
  }
}
