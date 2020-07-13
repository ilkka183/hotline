import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import MyCheck from '../components/form/MyCheck';
import MyInput from '../components/form/MyInput';
import MyLookupText from '../components/form/MyLookupText';
import MyPlainText from '../components/form/MyPlainText';
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
      const error = field.validate(this.state.data[field.name]);

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

  renderPlainText(name, label) {
    const { data, errors } = this.state;

    return (
      <MyPlainText
        asRow={this.asRow}
        key={name}
        name={name}
        label={label}
        value={data[name]}
        error={errors[name]}
      />
    );
  }

  renderLookupText(name, label, options) {
    const { data, errors } = this.state;

    return (
      <MyLookupText
        asRow={this.asRow}
        key={name}
        name={name}
        label={label}
        options={options}
        value={data[name]}
        error={errors[name]}
      />
    );
  }

  renderInput(name, label, type = 'text', readonly = false, autofocus = false) {
    const { data, errors } = this.state;

    return (
      <MyInput
        asRow={this.asRow}
        key={name}
        name={name}
        type={type}
        label={label}
        readonly={readonly}
        autofocus={autofocus}
        value={data[name]}
        error={errors[name]}
        onChange={this.handleChange}
      />
    );
  }

  renderTextArea(name, label, rows) {
    const { data, errors } = this.state;

    return (
      <MyTextArea
        asRow={this.asRow}
        key={name}
        name={name}
        label={label}
        rows={rows}
        value={data[name]}
        error={errors[name]}
        onChange={this.handleChange}
      />
    );
  }

  renderSelect(name, label, options) {
    const { data, errors } = this.state;

    return (
      <MySelect
        asRow={this.asRow}
        key={name}
        name={name}
        label={label}
        options={options}
        value={data[name]}
        error={errors[name]}
        onChange={this.handleChange}
      />
    );
  }

  renderCheck(name, label) {
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
