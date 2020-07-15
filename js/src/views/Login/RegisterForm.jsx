import React from 'react';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import FieldsForm from '../../components/common/FieldsForm';
import auth from '../../services/authService';

export default class RegisterForm extends FieldsForm {
  state = {
    data: {},
    errors: {}
  }

  constructor() {
    super();

    this.addField('email',     'Sähköposti', 'text', { email: true, required: true });
    this.addField('password',  'Salasana',   'text', { min: 5, required: true });
    this.addField('firstName', 'Etunimi',    'text', { required: true });
    this.addField('lastName',  'Sukunimi',   'text', { required: true });

    this.state.data = this.schema.emptyData();
  }

  get asRow() {
    return false;
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
