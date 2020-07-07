import React from 'react';
import Form from 'react-bootstrap/Form'
import BaseForm from './BaseForm';
import http from '../services/httpService';
import { apiUrl } from '../config.json';

export default class DataForm extends BaseForm {
  get dataId() {
    return this.props.match.params.id;
  }

  get apiEndpoint() {
    return apiUrl + '/' + this.getRestName();
  }

  itemToData(item) {
    return item;
  }

  async populateData(id) {
    try {
      const { data: item } = await http.get(this.apiEndpoint + '/' + id);
      console.log('item', item);
      const data = this.itemToData(item);
      console.log('data', data);

      this.setState({ data });
    }  catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace('/not-found');
    }
  }

  async populateLookups() {
    for (let field of this.schema.fields)
      if (field.lookupFunc) {
        const { data } = await field.lookupFunc();
        field.lookup = data;

        console.log(data);
      }
  }

  async componentDidMount() {
    this.populateLookups();

    if (this.dataId !== 'new')
      await this.populateData(this.dataId);
  }

  async doSubmit() {
    const { data } = this.state;

    console.log(data);

    if (data.Id)
      await http.put(this.apiEndpoint + '/' + data.Id, data);
    else
      await http.post(this.apiEndpoint, data);

    this.props.history.push('/' + this.getRestName());
  }

  renderField(field) {
    if (field.lookup)
      return this.renderSelect(field.name, field.title, field.lookup);
    else
      return this.renderInput(field.name, field.title);
  }

  render() {
    return (
      <>
        {this.renderHeader(this.getTitle() + ' - ' + this.dataId)}
        <Form onSubmit={this.handleSubmit}>
          {this.schema.fields.map(field => this.renderField(field))}
          {this.renderSubmitButton('Save')}
        </Form>
      </>
    );
  }
}
