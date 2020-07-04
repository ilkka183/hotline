import React from 'react';
import Joi from 'joi-browser';
import Form from '../components/common/Form';

export default class RegisterForm extends Form {
  state = {
    data: {
      username: '',
      password: '',
      name: ''
    },
    errors: {}
  }

  schema = {
    username: Joi.string().required().email(),
    password: Joi.string().required().min(5),
    name: Joi.string().required()
  }

  doSubmit() {
    // Call the server
    console.log('Submitted');
  }

  render() {
    return (
      <div>
        {this.renderHeader('Register')}
        <form onSubmit={this.handleSubmit}>
          {this.renderInput('username', 'Username', 'text', true)}
          {this.renderInput('password', 'Password', 'password')}
          {this.renderInput('name', 'Name')}
          {this.renderButton('Register')}
        </form>
      </div>
    );
  }
}
