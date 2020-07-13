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

      console.log(item);
      console.log(data);

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

      const row = {};
      
      for (let field of this.schema.fields) {
        const value = data[field.name];

        if (value !== '' && value !== savedData[field.name])
          row[field.name] = field.dataToJson(value);
      }

      if (Object.keys(row).length > 0) {
        try {
          console.log('put', row);
          await http.put(this.apiEndpointOf(data.Id), row);
        }
        catch (ex) {
          toast.error(ex.response.data.sqlMessage);
        }
      }
    }
    else {
      // POST
      try {
        const row = {};
        
        for (let field of this.schema.fields) {
          const value = data[field.name];

          if (field.hasFormControl(value))
            row[field.name] = field.dataToJson(value);
        }

        console.log('post', row);
        await http.post(this.apiEndpoint, row);
      }
      catch (ex) {
        toast.error(ex.response.data.sqlMessage);
      }
    }

    this.props.history.goBack();
  }

  renderField(field) {
    const value = this.state.data[field.name];

    if (!field.hasFormControl(value))
      return null;

    if (field.lookup)
      return this.renderSelect(field);

    switch (field.type) {
      case 'boolean': return this.renderCheck(field);
      case 'textarea': return this.renderTextArea(field);
      default: return this.renderInput(field);
    }
  }

  get title() {
    let title = this.schema.singularTitle;

    if (this.dataId === 'new')
      title += ' - uusi';

    return title;
  }

  render() {
    return (
      <Container>
        {this.renderTitle(this.title)}
        <Form onSubmit={this.handleSubmit}>
          {this.schema.fields.map(field => this.renderField(field))}
          {this.renderSubmitButton('Tallenna')}
        </Form>
      </Container>
    );
  }
}
