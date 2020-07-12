import React from 'react';
import { toast } from 'react-toastify';
import Form from 'react-bootstrap/Form'
import BaseForm from '../BaseForm';
import { Schema } from '../../schemas/Schema';
import { FUELS } from '../../schemas/ProblemSchema';
import http from '../../services/httpService';
import { apiUrl } from '../../config.json';


class ProblemSchema extends Schema {
  constructor() {
    super('Problem');
    
    this.addField('brand',       'Merkki',  'text', { required: true });
    this.addField('title',       'Otsikko', 'text', { required: true });
    this.addField('description', 'Kuvaus',  'text', { required: true });
  }
}


export default class ProblemForm extends BaseForm {
  schema = new ProblemSchema()

  state = {
    data: this.schema.initFormData(),
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
    const fuels = Schema.enumsToLookup(FUELS);

    return (
      <Form onSubmit={this.handleSubmit}>
        {this.renderInput('brand', 'Merkki')}
        {this.renderInput('model', 'Malli')}
        {this.renderInput('modelYear', 'Mallivuosi')}
        {this.renderSelect('fuel', 'Käyttövoima', fuels)}
        {this.renderInput('title', 'Otsikko')}
        {this.renderTextArea('description', 'Kuvaus', 10)}
        {this.renderSubmitButton('Tallenna')}
      </Form>
    );
  }
}
