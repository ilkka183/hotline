import React from 'react';
import { toast } from 'react-toastify';
import Form from 'react-bootstrap/Form'
import BaseForm from '../BaseForm';
import { Schema } from '../../schemas/Schema';
import { FUELS } from '../../schemas/ProblemsSchema';
import http from '../../services/httpService';
import { apiUrl } from '../../config.json';


class ProblemSchema extends Schema {
  constructor() {
    super('problems', 'Vikatapaus');
    
    this.brand       = this.addField('brand',       'Merkki',      'text',     { required: true });
    this.model       = this.addField('model',       'Malli',       'text');
    this.modelYear   = this.addField('modelYear',   'Vuosimalli',  'number');
    this.fuel        = this.addField('fuel',        'Käyttövoima', 'number',   { enums: FUELS });
    this.title       = this.addField('title',       'Otsikko',     'text',     { required: true });
    this.description = this.addField('description', 'Kuvaus',      'textarea', { required: true, rows: 10 });
  }
}


export default class ProblemForm extends BaseForm {
  schema = new ProblemSchema()

  state = {
    data: this.schema.emptyData(),
    errors: {}
  }

  async doSubmit() {
    try {
      const { data } = this.state;
      console.log('post', data);
      await http.post(apiUrl + '/problems', data);
    }
    catch (ex) {
      toast.error(ex.response.data.sqlMessage);
    }
}

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        {this.renderInput(this.schema.brand)}
        {this.renderInput(this.schema.model)}
        {this.renderInput(this.schema.modelYear)}
        {this.renderSelect(this.schema.fuel)}
        {this.renderInput(this.schema.title)}
        {this.renderTextArea(this.schema.description)}
        {this.renderSubmitButton('Tallenna')}
      </Form>
    );
  }
}
