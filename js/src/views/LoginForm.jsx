import React from 'react';
import Joi from 'joi-browser';
import Form from '../components/common/Form';
import auth from '../services/authService';

export default class LoginForm extends Form {
  state = {
    data: {
      email: '',
      password: ''
    },
    errors: {}
  }

  schema = {
    email: Joi.string().required(),
    password: Joi.string().required()
  }

  async doSubmit() {
    try {
      const { data } = this.state;
      await auth.login(data.email, data.password);
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
    return (
      <div>
        {this.renderHeader('Login')}
        <form onSubmit={this.handleSubmit}>
          {this.renderInput('email', 'Email', 'text', true)}
          {this.renderInput('password', 'Password', 'password')}
          {this.renderButton('Login')}
        </form>
      </div>
    );
  }
}
