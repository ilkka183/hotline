import React from 'react';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Table from 'react-bootstrap/Table'
import FieldsComponent, { Field } from './Fields';
import MyCheck from '../form/MyCheck';
import MyFile from '../form/MyFile';
import MyInput from '../form/MyInput';
import MySelect from '../form/MySelect';
import MyTextArea from '../form/MyTextArea';

export interface FieldsFormProps {
  asTable?: boolean,
  showTitle?: boolean,
  submitButtonVariant?: string,
  submitButtonText?: string,
  cancelButtonText?: string,
  showSubmitButton?: boolean,
  variant?: string,
  action?: string,
  showModal?: boolean,
  onHideModal?: () => void,
  onPrev?: () => void,
  onSubmitModal?: () => void
}

interface State {
  savedData: any,
  data: any,
  errors: any,
  successText: string,
  errorText: string
}

export default abstract class FieldsForm<P> extends FieldsComponent<P & FieldsFormProps, State> {
  static defaultProps = {
    asTable: false,
    showTitle: true,
    showSubmitButton: true,
    submitButtonVariant: 'primary',
    submitButtonText: 'Tallenna',
    cancelButtonText: 'Peru'
  }

  public state: State = {
    savedData: {},
    data: {},
    errors: {},
    successText: '',
    errorText: ''
  }

  private autofocusSet: boolean = false;

  public getData(): any {
    return this.state.data;
  }

  public getEmptyData(): any {
    const data: any = {}

    for (let field of this.fields)
      data[field.name] = '';

    return data;
  }

  public getDefaultData(): any {
    const data: any = {}

    for (let field of this.fields)
      data[field.name] = field.defaultValue;

    return data;
  }

  public jsonToData(row: any): any {
    const data: any = {}

    for (let field of this.fields)
      data[field.name] = field.jsonToData(row[field.name]);

    return data;
  }

  private validate(): any {
    const errors: any = {}

    for (const field of this.fields) {
      const data: any = this.state.data;
      const value: any = data[field.name];

      const error: string | null = field.validate(value);

      if (error) {
        errors[field.name] = error;
        break;
      }
    }

    return Object.keys(errors).length === 0 ? null : errors;
  }

  protected hasErrors(): any {
    const errors = this.validate();
    this.setState({ errors: errors || {} });

    return errors;
  }

  private validateField({ name, value }: any): any {
    const field = this.findField(name);
    return field && field.validate(value);
  }

  protected doSubmit(): void {
  }
  
  handleSubmit = (e: any) => {
    if (e)
      e.preventDefault();

    if (this.hasErrors())
      return;

    this.doSubmit();
  }

  handleSubmitModal = (e: any) => {
    const { action, onSubmitModal } = this.props;

    if (action !== 'delete') {
      if (this.hasErrors())
        return;
    }

    this.doSubmit();

    if (onSubmitModal)
      onSubmitModal();
  }

  handleChange = (event: any) => {
    const { currentTarget } = event;

    const errors: any = {...this.state.errors}
    const errorMessage = this.validateField(currentTarget);

    if (errorMessage)
      errors[currentTarget.name] = errorMessage;
    else
      delete errors[currentTarget.name];

    const data: any = {...this.state.data}

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
/*    const { history } = this.props;
    
    if (history)
      history.goBack(); */
  }

  renderInput(field: Field, autofocus: boolean = false) {
    const { name, label, readonly, required, type } = field;
    const data: any = this.state.data;
    const errors: any = this.state.errors;

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

  renderTextArea(field: Field) {
    const { name, label, required, rows } = field;
    const data: any = this.state.data;
    const errors: any = this.state.errors;

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

  renderFile(field: Field) {
    const { name, label, readonly, required } = field;
    const data: any = this.state.data;
    const errors: any = this.state.errors;

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

  renderSelect(field: Field, autofocus: boolean = false) {
    const { name, label, lookup, readonly, required } = field;
    const data: any = this.state.data;
    const errors: any = this.state.errors;

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

  renderCheck(field: Field) {
    const { name, label } = field;
    const data: any = this.state.data;
    const errors: any = this.state.errors;

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

  renderSubmitButton(text: string) {
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

  public abstract getTitle(): string;

  private renderField(field: Field): JSX.Element | null {
    const data: any = this.state.data;
    const value: any = data[field.name];

    if (!field.visible)
      return null;

    if (field.readonly && (!value && !field.isLookup))
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

  protected renderInfo(): JSX.Element | null {
    return null;
  }

  private renderForm(): JSX.Element {
    const { showTitle, submitButtonText, showSubmitButton} = this.props;
    const { successText, errorText } = this.state;

    this.autofocusSet = false;

    return (
      <Container>
        {showTitle && <h2>{this.getTitle()}</h2>}
        {this.renderInfo()}
        <Form onSubmit={this.handleSubmit}>
          {this.fields.map(field => this.renderField(field))}
          {showSubmitButton && this.renderSubmitButton(submitButtonText!)}
          {successText && <Alert variant="success">{successText}</Alert>}
          {errorText && <Alert variant="danger">{errorText}</Alert>}
        </Form>
      </Container>
    );
  }

  private renderModalFields(): (JSX.Element | null)[] | JSX.Element | null {
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
  
  private renderModal(): JSX.Element {
    const { showTitle, showModal, submitButtonVariant, submitButtonText, cancelButtonText, onHideModal } = this.props;

    return (
      <Modal
        size="xl"
        backdrop="static"
        show={showModal}
        onHide={onHideModal}
      >
        <Modal.Header closeButton>
          {showTitle && <Modal.Title>{this.getTitle()}</Modal.Title>}
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

  private renderTableRow(field: Field): JSX.Element | null {
    if (!field.visible)
      return null;

    const data = this.getData();
    const value = data[field.name];

    let text: JSX.Element | string | null = field.formatValue(value);

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

  private renderTable(): JSX.Element {
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

  public render(): JSX.Element {
    const { variant } = this.props;

    switch (variant) {
      case 'modal': return this.renderModal();
      case 'table': return this.renderTable();
    }

    return this.renderForm();
  }
}
