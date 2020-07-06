import React from 'react';
import Form from 'react-bootstrap/Form'
import BaseForm from '../components/BaseForm';
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
      const data = this.itemToData(item);

      this.setState({ data });
    }  catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace('/not-found');
    }
  }

  async componentDidMount() {
    this.populateOthers();

    if (this.dataId !== 'new')
      await this.populateData(this.dataId);
  }

  async doSubmit() {
    const { data } = this.state;

    if (data.Id)
      await http.put(this.apiEndpoint + '/' + data.Id, data);
    else
      await http.post(this.apiEndpoint, data);

    this.props.history.push('/' + this.getRestName());
  }

  render() {
    return (
      <>
        {this.renderHeader('Movie - ' + this.dataId)}
        <Form onSubmit={this.handleSubmit}>
          {this.renderControls()}
          {this.renderSubmitButton('Save')}
        </Form>
      </>
    );
  }
}
