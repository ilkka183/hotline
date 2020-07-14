import React from 'react';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import BaseForm from '../BaseForm';
import { Schema } from '../../schemas/Schema';
//import auth from '../services/authService';


class ChangePasswordSchema extends Schema {
  constructor() {
    super('ChangePassword');
    
    this.password  = this.addField('password',  'Nykyinen salasana',       'text', { min: 5, required: true });
    this.password1 = this.addField('password1', 'Uusi salasana',           'text', { min: 5, required: true });
    this.password2 = this.addField('password2', 'Uusi salasana uudestaan', 'text', { min: 5, required: true });
  }
}


export default class ChangePasswordForm extends BaseForm {
  schema = new ChangePasswordSchema()

  state = {
    data: this.schema.emptyFormData(),
    errors: {}
  }

  async doSubmit() {
    try {
//      const { password1, password2 } = this.state.data;
//      await auth.login(email, password);
    }
    catch (ex) {
      if (ex.response && (ex.response.status === 400 || ex.response.status === 401)) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;

        this.setState({ errors });
      }
    }
  }

  render() {
    return (
      <Container>
        {this.renderTitle('Vaihda salasana')}
        <Form onSubmit={this.handleSubmit}>
          {this.renderInput(this.schema.password)}
          {this.renderInput(this.schema.password1)}
          {this.renderInput(this.schema.password2)}
          {this.renderSubmitButton('Vaihda salasana')}
        </Form>
      </Container>
    );
  }
}
