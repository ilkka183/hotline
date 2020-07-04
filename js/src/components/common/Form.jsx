import React, { Component } from 'react';
import Joi from 'joi-browser';
import Input from './Input';
import Select from './Select';

export default class Form extends Component {
  state = {
    data: {},
    errors: {}
  }

  validate() {
    const { error } = Joi.validate(this.state.data, this.schema, { abortEarly: false });

    if (!error)
      return null;

    const errors = {}

    for (let item of error.details)
      errors[item.path[0]] = item.message;

    return errors;
  }

  validateProperty({ name, value }) {
    const obj = { [name]: value }
    const schema = { [name]: this.schema[name] }
    const { error } = Joi.validate(obj, schema);

    return error ? error.details[0].message : null;
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
    data[input.name] = input.value;

    this.setState({ data, errors });
  }

  renderHeader(text) {
    return <h1>{text}</h1>
  }

  renderInput(name, label, type = 'text', autoFocus = false) {
    const { data, errors } = this.state;

    return (
      <Input
        type={type}
        name={name}
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
      <Select
        name={name}
        label={label}
        options={options}
        value={data[name]}
        error={errors[name]}
        onChange={this.handleChange}
      />
    );
  }

  renderButton(label) {
    return <button className="btn btn-primary" disabled={this.validate()}>{label}</button>
  }
}
