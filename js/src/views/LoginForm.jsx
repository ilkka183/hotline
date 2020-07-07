import React from 'react';
import { Redirect } from 'react-router-dom';
import Form from 'react-bootstrap/Form'
import BaseForm from './BaseForm';
import { Schema } from '../schemas/Schema';
import auth from '../services/authService';


class LoginSchema extends Schema {
  constructor() {
    super();
    
    this.addField('email', 'text', { email: true, required: true });
    this.addField('password', 'text', { min: 5, required: true });
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
      const { data } = this.state;
      await auth.login(data.email, data.password);

      const { state } = this.props.location;
      window.location = state ? state.from.pathname : '/';
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
      <>
        {this.renderHeader('Login')}
        <Form onSubmit={this.handleSubmit}>
          {this.renderInput('email', 'Email', 'text', true)}
          {this.renderInput('password', 'Password', 'password')}
          {this.renderSubmitButton('Login')}
        </Form>
      </>
    );
  }
}
