import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import MyInput from '../components/common/MyInput';
import MySelect from '../components/common/MySelect';

export default class BaseForm extends Component {
  state = {
    data: {},
    errors: {}
  }

  validate() {
/*    const { error } = Joi.validate(this.state.data, this.schema, { abortEarly: false });

    if (!error)
      return null;

    const errors = {}

    for (let item of error.details)
      errors[item.path[0]] = item.message;

    return errors; */
    return null;
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
    data[input.name] = input.value;

    this.setState({ data, errors });
  }

  renderHeader(text) {
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

  renderSubmitButton(label) {
    return <Button variant="primary" type="submit" disabled={this.validate()}>{label}</Button>
   }
}
