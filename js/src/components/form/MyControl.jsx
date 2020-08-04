import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Required from './Required';

export default class MyControl extends Component {
  renderLabel() {
    const { label, required } = this.props;

    return (
      <>
        {label} {required && <Required />}
      </>
    );
  }

  renderAlert() {
    const { error } = this.props;

    if (error)
      return <Alert variant="danger">{error}</Alert>;

    return null;
  }

  renderContent() {
    return (
      <>
        {this.renderControl()}
        {this.renderAlert()}
      </>
    );
  }

  render() {
    const { asRow, name } = this.props;

    if (asRow) {
      return (
        <Form.Group as={Row} controlId={name}>
          <Form.Label column sm="2">{this.renderLabel()}</Form.Label>
          <Col sm="10">
            {this.renderContent()}
          </Col>
        </Form.Group>
      );
    }
  
    return (
      <Form.Group controlId={name}>
        <Form.Label>{this.renderLabel()}</Form.Label>
        {this.renderContent()}
      </Form.Group>
    );
  }
}
