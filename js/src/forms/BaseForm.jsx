import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import MyInput from '../components/form/MyInput';
import MySelect from '../components/form/MySelect';
import MyCheck from '../components/form/MyCheck';

export default class BaseForm extends Component {
  state = {
    data: {},
    errors: {}
  }

  // must be less or equal to 100
  // must be larger than or equal to 0

  validate() {
    const errors = {}

    for (const field of this.schema.fields)
      if (field.visibleInForm && field.required && field.type !== 'boolean' && !this.state.data[field.name]) {
        errors[field.name] = field.title + ' is not allowed to be empty';
        break;
      }

    return Object.keys(errors).length === 0 ? null : errors;
  }

  validateProperty({ name, value }) {
/*    const obj = { [name]: value }
    const schema = { [name]: this.schema[name] }
    const { error } = Joi.validate(obj, schema);

    return error ? error.details[0].message : null; */
    return null;
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
    return <h1>{text}</h1>
  }

  renderInput(name, label, type = 'text', autoFocus = false) {
    const { data, errors } = this.state;

    return (
      <MyInput
        key={name}
        name={name}
        type={type}
        label={label}
        value={data[name]}
        error={errors[name]}
        onChange={this.handleChange}
        autoFocus={autoFocus}
      />
    );
  }

  renderSelect(name, label, options) {
    const { data, errors } = this.state;

    return (
      <MySelect
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
