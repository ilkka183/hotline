import React from 'react';
import Joi from 'joi-browser';
import Form from '../components/common/Form';
import auth from '../services/authService';

export default class RegisterForm extends Form {
  state = {
    data: {
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    },
    errors: {}
  }

  schema = {
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
    firstName: Joi.string().required(),
    lastName: Joi.string().required()
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
      <div>
        {this.renderHeader('Register')}
        <form onSubmit={this.handleSubmit}>
        {this.renderInput('email', 'Email', 'text', true)}
          {this.renderInput('password', 'Password', 'password')}
          {this.renderInput('firstName', 'First Name')}
          {this.renderInput('lastName', 'Last Name')}
          {this.renderButton('Register')}
        </form>
      </div>
    );
  }
}
