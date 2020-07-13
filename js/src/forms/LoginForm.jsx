import React from 'react';
import { Redirect } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import BaseForm from './BaseForm';
import { Schema } from '../schemas/Schema';
import auth from '../services/authService';


class LoginSchema extends Schema {
  constructor() {
    super('Login');
    
    this.addField('email',    'Sähköposti', 'text', { email: true, required: true });
    this.addField('password', 'Salasana',   'text', { min: 5, required: true });
  }
}


export default class LoginForm extends BaseForm {
  schema = new LoginSchema()

  state = {
    data: this.schema.initFormData(),
    errors: {}
  }

  async doSubmit() {
    try {
      const { email, password } = this.state.data;
      await auth.login(email, password);
      window.location = '/';
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
    if (auth.getCurrentUser())
      return <Redirect to="/" />

    return (
      <Container>
        {this.renderTitle('Kirjaudu')}
        <Form onSubmit={this.handleSubmit}>
          {this.renderInput('email', 'Sähköposti', 'text', true)}
          {this.renderInput('password', 'Salasana', 'password')}
          {this.renderSubmitButton('Kirjaudu')}
        </Form>
      </Container>
    );
  }
}