import React from 'react';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import FieldsComponent from './Fields';
import MyCheck from '../form/MyCheck';
import MyInput from '../form/MyInput';
import MySelect from '../form/MySelect';
import MyTextArea from '../form/MyTextArea';

export default class BaseForm extends FieldsComponent {
//  autofocusSet = false;

  state = {
    data: {},
    errors: {}
  }

  getEmptyData() {
    const data = {}

    for (let field of this.fields)
      data[field.name] = '';

    return data;
  }

  getDefaultData() {
    const data = {}

    for (let field of this.fields)
      data[field.name] = field.defaultValue;

    return data;
  }

  jsonToData(row) {
    const data = {}

    for (let field of this.fields)
      data[field.name] = field.jsonToData(row[field.name]);

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

  validateField({ name, value }) {
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
    const errorMessage = this.validateField(input);

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

  getAsRow() {
    return true;
  }

  renderInput(field, autofocus = false) {
    const { name, label, readonly, required, type } = field;
    const { data, errors } = this.state;

    return (
      <MyInput
        asRow={this.getAsRow()}
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
        asRow={this.getAsRow()}
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
        asRow={this.getAsRow()}
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
        asRow={this.getAsRow()}
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
        disabled={this.validate()}
      >
        {label}
      </Button>
    );
  }

  get formattedTitle() {
    return this.getTitle();
  }

  getTitle() {
    return null;
  }

  getButtonLabel() {
    return 'Tallenna';
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

      default:
        let autofocus = false;

        if (!field.readonly && !this.autofocusSet) {
          autofocus = true;
          this.autofocusSet = true;
        }

        return this.renderInput(field, autofocus);
    }
  }

  render() {
    const { successText, errorText } = this.state;
    this.autofocusSet = false;

    return (
      <Container>
        <h2>{this.formattedTitle}</h2>
        <Form onSubmit={this.handleSubmit}>
          {this.fields.map(field => this.renderField(field))}
          {this.renderSubmitButton(this.getButtonLabel())}
          {successText && <Alert variant="success">{successText}</Alert>}
          {errorText && <Alert variant="danger">{errorText}</Alert>}
        </Form>
      </Container>
    );
  }
}
