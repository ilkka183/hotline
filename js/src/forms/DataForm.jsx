import React from 'react';
import { toast } from 'react-toastify';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import BaseForm from './BaseForm';
import { Schema } from '../schemas/Schema';
import http from '../services/httpService';
import { apiUrl } from '../config.json';

export default class DataForm extends BaseForm {
  get dataId() {
    return this.props.match.params.id;
  }

  get apiEndpoint() {
    return apiUrl + '/' + this.schema.pluralName;
  }

  apiEndpointOf(id) {
    return this.apiEndpoint + '/' + id;
  }

  async populateLookups() {
    for (const field of this.schema.fields) {
      if (field.lookupUrl) {
        const { data } = await http.get(apiUrl + '/' + field.lookupUrl);
        const lookup = [{ Id: null, Name: '' }, ...data];
        field.lookup = lookup;

        this.setState({ lookup });
      }
      else if (field.enums) {
        const lookup = Schema.enumsToLookup(field.enums);
        field.lookup = lookup;

        this.setState({ lookup });
      }
    }
  }

  async populateData(id) {
    try {
      const { data: item } = await http.get(this.apiEndpointOf(id));
      const savedData = this.schema.jsonToData(item)
      const data = this.schema.jsonToData(item)

      this.setState({ savedData, data });
    }
    catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace('/not-found');
    }
  }

  async componentDidMount() {
    this.populateLookups();

    if (this.dataId !== 'new')
      await this.populateData(this.dataId);
  }

  async doSubmit() {
    const { data } = this.state;

    if (data.Id) {
      // PUT
      const { savedData } = this.state;

      const modifiedFields = {};
      let modified = false;
      
      for (let field of this.schema.fields) {
        if (data[field.name] !== '' && data[field.name] !== savedData[field.name]) {
          modifiedFields[field.name] = field.dataToJson(data[field.name]);
          modified = true;
        }
      }

      if (modified) {
        try {
          console.log('put', modifiedFields);
          await http.put(this.apiEndpointOf(data.Id), modifiedFields);
        }
        catch (ex) {
          toast.error(ex.response.data.sqlMessage);
        }
      }
    }
    else {
      // POST
      try {
        console.log('post', data);
        await http.post(this.apiEndpoint, data);
      }
      catch (ex) {
        toast.error(ex.response.data.sqlMessage);
      }
    }

    this.props.history.goBack();
  }

  renderField(field) {
    if (!field.visibleInForm)
      return null;

    const value = this.state.data[field.name];

    if ((field.readonly || (field.type === 'datetime')) && value === null)
      return null;

    if (field.required) {
      // TODO: bold label
    }

    if (field.lookup)
      return this.renderSelect(field.name, field.label, field.lookup, field.readonly);

    switch (field.type) {
      case 'boolean': return this.renderCheck(field.name, field.label);
      case 'datetime': return this.renderPlainText(field.name, field.label);
      case 'plaintext': return this.renderPlainText(field.name, field.label);
      case 'textarea': return this.renderTextArea(field.name, field.label, 5);
      default: return this.renderInput(field.name, field.label, field.type, field.readonly);
      }
  }

  formatTitle() {
    return this.schema.singularTitle + ' - ' + (this.dataId === 'new' ? 'uusi' : this.dataId);
  }

  render() {
    return (
      <Container>
        {this.renderTitle(this.formatTitle())}
        <Form onSubmit={this.handleSubmit}>
          {this.schema.fields.map(field => this.renderField(field))}
          {this.renderSubmitButton('Tallenna')}
        </Form>
      </Container>
    );
  }
}
