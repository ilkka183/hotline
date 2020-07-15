import React from 'react';
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import FieldsComponent from './Fields';
import MyCheck from '../form/MyCheck';
import MyInput from '../form/MyInput';
import MySelect from '../form/MySelect';
import MyTextArea from '../form/MyTextArea';

export default class BaseForm extends FieldsComponent {
  state = {
    data: {},
    errors: {}
  }

  emptyData() {
    const data = {}

    for (let field of this.fields)
      data[field.name] = '';

    return data;
  }

  defaultData() {
    const data = {}

    for (let field of this.fields)
      data[field.name] = field.defaultValue;

    return data;
  }

  validate() {
    const errors = {}

    for (const field of this.fields) {
      const value = this.state.data[field.name];

      const error = field.validate(value);

      if (error) {
        errors[field.name] = error;
        break;
      }
    }

    return Object.keys(errors).length === 0 ? null : errors;
  }

  validateProperty({ name, value }) {
    const field = this.findField(name);
    return field && field.validate(value);
  }

  doSubmit() {
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

  get asRow() {
    return true;
  }

  renderTitle(text) {
    return <h2>{text}</h2>
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

  renderField(field) {
    const value = this.state.data[field.name];

    if (!field.visible)
      return null;

    if (field.readonly && !value)
      return null;

    if (field.isLookup)
      return this.renderSelect(field);

    switch (field.type) {
      case 'boolean': return this.renderCheck(field);
      case 'textarea': return this.renderTextArea(field);
      default: return this.renderInput(field);
    }
  }

  get formattedTitle() {
    return this.getTitle();
  }

  get buttonLabel() {
    return 'Tallenna';
  }

  render() {
    return (
      <Container>
        {this.renderTitle(this.formattedTitle)}
        <Form onSubmit={this.handleSubmit}>
          {this.fields.map(field => this.renderField(field))}
          {this.renderSubmitButton(this.buttonLabel)}
        </Form>
      </Container>
    );
  }
}
