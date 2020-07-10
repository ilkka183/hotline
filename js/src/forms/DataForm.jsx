import React from 'react';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import BaseForm from './BaseForm';
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
      const nullItem = { Id: null, Name: '' };

      if (field.lookupFunc) {
        const { data } = await field.lookupFunc();
        const lookup = [nullItem, ...data];
        field.lookup = lookup;

        this.setState({ lookup });
      }
      else if (field.enums) {
        const lookup = [nullItem];

        for (const index in field.enums)
          lookup.push({ Id: index, Name: field.enums[index] });

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
    }  catch (ex) {
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
        console.log('put', modifiedFields);
        await http.put(this.apiEndpointOf(data.Id), modifiedFields);
      }
    }
    else {
      // POST
      console.log('post', data);
      await http.post(this.apiEndpoint, data);
    }

    this.props.history.goBack();
  }

  renderField(field) {
    if (!field.visibleInForm)
      return null;

    let title = field.title;

    if (!field.required)
      title += ' - optional';

    if (field.lookup)
      return this.renderSelect(field.name, title, field.lookup);

    switch (field.type) {
      case 'boolean': return this.renderCheck(field.name, field.title);
      case 'textarea': return this.renderTextarea(field.name, field.title, 5);

      default:
        if (field.readonly)
          return this.renderPlainText(field.name, title);
        else
          return this.renderInput(field.name, title);
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
