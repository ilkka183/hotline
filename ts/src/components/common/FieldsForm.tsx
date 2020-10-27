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

export enum EditMode {
  Insert,
  Update,
  Delete
}

export interface FormErrors {
  errors?: any,
  errorText?: string
}

export interface FieldsFormProps {
  asTable?: boolean,
  showTitle?: boolean,
  submitButtonText?: string,
  cancelButtonText?: string,
  showSubmitButton?: boolean,
  variant?: string,
  editMode?: EditMode,
  showModal?: boolean,
  onSubmitted?: () => void,
  onModalSubmitted?: () => void,
  onHideModal?: () => void
}

interface State {
  savedData: any,
  data: any,
  errors: any,
  errorText: string | undefined,
  successText: string | undefined
}

export default abstract class FieldsForm<P> extends FieldsComponent<P & FieldsFormProps, State> {
  static defaultProps = {
    asTable: false,
    showTitle: true,
    showSubmitButton: true,
    submitButtonText: 'Tallenna',
    cancelButtonText: 'Peru'
  }

  public state: State = {
    savedData: {},
    data: {},
    errors: {},
    successText: undefined,
    errorText: undefined
  }

  private get submitButtonText(): string {
    const { submitButtonText } = this.props;
    const text = this.getSubmitButtonText();

    return text ? text : submitButtonText!;
  }

  private get cancelButtonText(): string {
    const { cancelButtonText } = this.props;
    const text = this.getCancelButtonText();

    return text ? text : cancelButtonText!;
  }

  protected getSubmitButtonText(): string | undefined {
    return undefined;
  }

  protected getCancelButtonText(): string | undefined {
    return undefined;
  }

  private autofocusSet: boolean = false;

  public getData(): any {
    return this.state.data;
  }

  public getEmptyData(): any {
    const data: any = {}

    for (const field of this.fields)
      data[field.name] = '';

    return data;
  }

  public getDefaultData(): any {
    const data: any = {}

    for (const field of this.fields)
      data[field.name] = field.defaultValue;

    return data;
  }

  public jsonToData(row: any): any {
    const data: any = {}

    for (const field of this.fields)
      data[field.name] = field.jsonToData(row[field.name]);

    return data;
  }

  private validate(breakOnFirst: boolean): any {
    let errors: any = undefined;

    for (const field of this.fields) {
      const data: any = this.state.data;
      const value: any = data[field.name];

      const error: string | null = field.validate(value);

      if (error) {
        if (!errors)
          errors = {};

        errors[field.name] = error;

        if (breakOnFirst)
          break;
      }
    }

    return errors;
  }

  protected hasErrors(breakOnFirst: boolean = true): boolean {
    const errors = this.validate(breakOnFirst);
    
    this.setState({ errors: errors || {} });

    return errors;
  }

  private validateField(name: string, value: any): string | null {
    const field: Field | null = this.findField(name);

    if (field)
      return field.validate(value);

    return null;
  }

  protected async doSubmit(): Promise<FormErrors | null> {
    return null;
  }
  
  protected afterSubmit() {
    const { onSubmitted } = this.props;

    if (onSubmitted)
      onSubmitted();
  }

  private handleErrors(response: FormErrors) {
    const errors: any = response.errors || {};

    this.setState({
      errors,
      errorText: response.errorText
    });
  }

  protected readonly handleSubmit = async (event: any) => {
    if (event)
      event.preventDefault();

    if (this.hasErrors())
      return;

    const response = await this.doSubmit();

    if (response) {
      this.handleErrors(response);
    } else {
      this.afterSubmit();
    }
  }

  protected readonly handleSubmitModal = async () => {
    const { editMode, onModalSubmitted } = this.props;

    if (this.hasErrors() && (editMode !== EditMode.Delete))
      return;

    const response = await this.doSubmit();

    if (response) {
      this.handleErrors(response);
    } else {
      this.afterSubmit();

      if (onModalSubmitted)
        onModalSubmitted();
    }
  }

  protected readonly handleChange = (event: any) => {
    const { currentTarget } = event;

    const errors: any = {...this.state.errors}
    const errorMessage: string | null = this.validateField(currentTarget.name, currentTarget.value);

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

      const file: any = event.target.files[0];

      const info: any = {
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

  protected getAsRow(): boolean {
    return true;
  }

  protected renderInput(field: Field, autofocus: boolean = false): JSX.Element {
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

  protected renderTextArea(field: Field): JSX.Element {
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

  protected renderFile(field: Field): JSX.Element {
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

  protected renderSelect(field: Field, autofocus: boolean = false): JSX.Element {
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
        value={data[name]}
        error={errors[name]}
        onChange={this.handleChange}
      />
    );
  }

  protected renderCheck(field: Field): JSX.Element {
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

  protected renderSubmitButton(text: string): JSX.Element {
    return (
      <Button
        className="mr-2 mb-2"
        variant="primary"
        type="submit"
        disabled={/*this.validate() &&*/ false}
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

    if (field.readonly && !value)
      return null;

    if (field.isLookup) {
      let autofocus: boolean = false;

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
    }

    let autofocus: boolean = false;

    if (!field.readonly && !this.autofocusSet) {
      autofocus = true;
      this.autofocusSet = true;
    }
    
    return this.renderInput(field, autofocus);
  }

  protected renderInfo(): JSX.Element | null {
    return null;
  }

  private renderForm(): JSX.Element {
    const { showTitle, showSubmitButton} = this.props;
    const { successText, errorText } = this.state;

    this.autofocusSet = false;

    return (
      <Container>
        {showTitle && <h2>{this.getTitle()}</h2>}
        {this.renderInfo()}
        <Form onSubmit={this.handleSubmit}>
          {this.fields.map(field => this.renderField(field))}
          {showSubmitButton && this.renderSubmitButton(this.submitButtonText)}
          {successText && <Alert variant="success">{successText}</Alert>}
          {errorText && <Alert variant="danger">{errorText}</Alert>}
        </Form>
      </Container>
    );
  }

  private renderModalFields(): (JSX.Element | null)[] | JSX.Element | null {
    const { editMode } = this.props;

    if (editMode === EditMode.Delete)
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
    const { showTitle, showModal, editMode, onHideModal } = this.props;
    const { errorText } = this.state;

    const submitVariant = editMode === EditMode.Delete ? 'danger' : 'primary';
    const submitText = editMode === EditMode.Delete ? 'Poista' : this.submitButtonText;
    const cancelText = this.cancelButtonText;

    return (
      <Modal
        size="xl"
        backdrop="static"
        autoFocus={false}
        show={showModal}
        onHide={onHideModal}
      >
        <Modal.Header closeButton>
          {showTitle && <Modal.Title>{this.getTitle()}</Modal.Title>}
        </Modal.Header>

        <Modal.Body>
          {this.renderInfo()}
          {this.renderModalFields()}
        </Modal.Body>

        <Modal.Footer>
          <Button variant={submitVariant} onClick={this.handleSubmitModal}>{submitText}</Button>
          <Button variant="secondary" onClick={onHideModal}>{cancelText}</Button>
        </Modal.Footer>

        {errorText &&
          <Modal.Footer>
            <Alert variant="danger">{errorText}</Alert>
          </Modal.Footer>}
      </Modal>      
    );
  }

  protected formatDateTimes(): boolean {
    return false;
  }

  private renderTableRow(field: Field): JSX.Element | null {
    if (!field.visible)
      return null;

    const data: any = this.getData();

    if (field.show && !field.show(data))
      return null;

    const value: any = data[field.name];

    let text: JSX.Element | string | null = field.formatValue(value, this.formatDateTimes());

    if (!text)
      return null;
      
    if (field.renderText)
      text = field.renderText(text);
    else if (field.isCode)
      text = <code>{text}</code>
    else if (field.preformatted)
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
