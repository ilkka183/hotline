import React from 'react';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Table from 'react-bootstrap/Table'
import FieldsComponent from './Fields';
import MyCheck from '../form/MyCheck';
import MyFile from '../form/MyFile';
import MyInput from '../form/MyInput';
import MySelect from '../form/MySelect';
import MyTextArea from '../form/MyTextArea';

export default class FieldsForm extends FieldsComponent {
  state = {
    data: {},
    errors: {}
  }

  getData() {
    return this.state.data;
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

  hasErrors() {
    const errors = this.validate();
    this.setState({ errors: errors || {} });

    return errors;
  }

  validateField({ name, value }) {
    const field = this.findField(name);
    return field && field.validate(value);
  }

  doSubmit() {
  }
  
  handleSubmit = e => {
    if (e)
      e.preventDefault();

    if (this.hasErrors())
      return;

    this.doSubmit();
  }

  handleSubmitModal = e => {
    const { action, onSubmitModal } = this.props;

    if (action !== 'delete') {
      if (this.hasErrors())
        return;
    }

    this.doSubmit();

    onSubmitModal();
  }

  handleChange = event => {
    const { currentTarget } = event;

    const errors = {...this.state.errors}
    const errorMessage = this.validateField(currentTarget);

    if (errorMessage)
      errors[currentTarget.name] = errorMessage;
    else
      delete errors[currentTarget.name];

    const data = {...this.state.data}

    if (currentTarget.type === 'checkbox')
      data[currentTarget.name] = currentTarget.checked;
    else if (currentTarget.type === 'file') {
      console.log(event.target.files);
      console.log(currentTarget.value);

      const file = event.target.files[0];

      const info = {
        name: file.name,
        size: file.size,
        type: file.type
      }

      data[currentTarget.name] = currentTarget.value;
      data['FileName'].value = info.name;
      data['FileSize'].value = info.size;
      data['FileType'].value = info.type;
    }
    else
      data[currentTarget.name] = currentTarget.value;

    this.setState({ data, errors });
  }

  getAsRow() {
    return true;
  }

  goBack() {
    const { history } = this.props;
    
    if (history)
      history.goBack();
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

  renderFile(field) {
    const { name, label, readonly, required } = field;
    const { data, errors } = this.state;

    return (
      <MyFile
        asRow={this.getAsRow()}
        key={name}
        name={name}
        label={label}
        required={required}
        disabled={readonly}
        value={data[name]}
        error={errors[name]}
        onChange={this.handleChange}
      />
    );
  }

  renderSelect(field, autofocus = false) {
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
        autofocus={autofocus}
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

  renderSubmitButton(text) {
    return (
      <Button
        className="mr-2"
        variant="primary"
        type="submit"
        disabled={this.validate() && false}
      >
        {text}
      </Button>
    );
  }

  getNewTitle() {
    throw new Error('You have to implement the method getTitle');
  }

  getEditTitle() {
    throw new Error('You have to implement the method getTitle');
  }

  getDeleteTitle() {
    throw new Error('You have to implement the method getTitle');
  }

  getTitle() {
    const { action } = this.props;

    switch (action) {
      case 'new': return this.getNewTitle();
      case 'edit': return this.getEditTitle();
      case 'delete': return this.getDeleteTitle() + '?';
      default: return null;
    }
  }

  renderField(field) {
    const value = this.state.data[field.name];

    if (!field.visible)
      return null;

    if (field.readonly && !value)
      return null;

    if (field.isLookup) {
      let autofocus = false;

      if (!field.readonly && !this.autofocusSet) {
        autofocus = true;
        this.autofocusSet = true;
      }

      return this.renderSelect(field, autofocus);
    }

    switch (field.type) {
      case 'boolean': return this.renderCheck(field);
      case 'file': return this.renderFile(field);
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

  renderInfo() {
  }

  renderForm() {
    const { showTitle, submitButtonText, showSubmitButton} = this.props;
    const { successText, errorText } = this.state;

    this.autofocusSet = false;

    return (
      <Container>
        {showTitle && <h2>{this.getTitle()}</h2>}
        {this.renderInfo()}
        <Form onSubmit={this.handleSubmit}>
          {this.fields.map(field => this.renderField(field))}
          {showSubmitButton && this.renderSubmitButton(submitButtonText)}
          {successText && <Alert variant="success">{successText}</Alert>}
          {errorText && <Alert variant="danger">{errorText}</Alert>}
        </Form>
      </Container>
    );
  }

  renderModalFields() {
    const { action } = this.props;

    if (action === 'delete')
      return (
        <Table size="sm">
          <tbody>
            {this.fields.map(field => this.renderTableRow(field))}
          </tbody>
        </Table>
      );
    else
      return this.fields.map(field => this.renderField(field));
  }
  
  renderModal() {
    const { showModal, submitButtonVariant, submitButtonText, cancelButtonText, onHideModal } = this.props;

    return (
      <Modal
        size="xl"
        backdrop="static"
        show={showModal}
        onHide={onHideModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>{this.getTitle()}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.renderModalFields()}
        </Modal.Body>

        <Modal.Footer>
          <Button variant={submitButtonVariant} onClick={this.handleSubmitModal}>{submitButtonText}</Button>
         <Button variant="secondary" onClick={onHideModal}>{cancelButtonText}</Button>
        </Modal.Footer>
      </Modal>      
    );
  }

  renderTableRow(field) {
    const data = this.getData();
    const value = data[field.name];

    let text = field.formatValue(value);

    if (!text)
      return null;
      
    if (field.preformatted)
      text = <pre>{text}</pre>

    return (
      <tr key={field.name}>
        <td>{field.label}</td>
        <td>{text}</td>
      </tr>
    );
  }

  renderTable() {
    const { showTitle } = this.props;

    return (
      <>
        {showTitle && <h2>{this.getTitle()}</h2>}
        <Table size="sm">
          <tbody>
            {this.fields.map(field => this.renderTableRow(field))}
          </tbody>
        </Table>
      </>
    );
  }

  render() {
    const { variant } = this.props;

    switch (variant) {
      case 'modal': return this.renderModal();
      case 'table': return this.renderTable();
      default:  return this.renderForm();
    }
  }
}

FieldsForm.defaultProps = {
  asTable: false,
  showTitle: true,
  showSubmitButton: true,
  submitButtonVariant: 'primary',
  submitButtonText: 'Tallenna',
  cancelButtonText: 'Peru'
}

