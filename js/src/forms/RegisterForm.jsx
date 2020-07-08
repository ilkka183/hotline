import React from 'react';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import BaseForm from './BaseForm';
import { Schema } from '../schemas/Schema';
import auth from '../services/authService';


class RegisterSchema extends Schema {
  constructor() {
    super();

    this.addField('email', 'text', { email: true, required: true });
    this.addField('password', 'text', { min: 5, required: true });
    this.addField('firstName', 'text', { required: true });
    this.addField('lastName', 'text', { required: true });
  }
}


export default class RegisterForm extends BaseForm {
  schema = new RegisterSchema()

  state = {
    data: this.schema.initFormData(),
    errors: {}
  }

  async doSubmit() {
    try {
      const data = {
        GroupId: 1,
        Role: 2,
        FirstName: this.state.data.firstName,
        LastName: this.state.data.lastName,
        Email: this.state.data.email,
        Password: this.state.data.password,
        Enabled: true
      }

      await auth.register(data);
      window.location = '/';
    }
    catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data.sqlMessage;

        this.setState({ errors });
      }
    }
  }

  render() {
    return (
      <Container>
        {this.renderTitle('Rekisteröidy')}
        <Form onSubmit={this.handleSubmit}>
        {this.renderInput('email', 'Sähköposti', 'text', true)}
          {this.renderInput('password', 'Salasana', 'password')}
          {this.renderInput('firstName', 'Etunimi')}
          {this.renderInput('lastName', 'Sukunimi')}
          {this.renderSubmitButton('Rekisteröidy')}
        </Form>
      </Container>
    );
  }
}
