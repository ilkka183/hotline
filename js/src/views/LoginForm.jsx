import React from 'react';
import Joi from 'joi-browser';
import Form from '../components/common/Form';

export default class LoginForm extends Form {
  state = {
    data: {
      username: '',
      password: ''
    },
    errors: {}
  }

  schema = {
    username: Joi.string().required(),
    password: Joi.string().required()
  }

  doSubmit() {
    // Call the server
    console.log('Submitted');
  }

  render() {
    return (
      <div>
        {this.renderHeader('Login')}
        <form onSubmit={this.handleSubmit}>
          {this.renderInput('username', 'Username', 'text', true)}
          {this.renderInput('password', 'Password', 'password')}
          {this.renderButton('Login')}
        </form>
      </div>
    );
  }
}
