import React from 'react';
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Required from './Required';

export interface ControlProps {
  name: string,
  label: string,
  error: string,
  asRow: boolean,
  required?: boolean,
  onChange: (event: any) => void
}

export default abstract class MyControl<P> extends React.Component<P & ControlProps> {
  protected renderLabel(): JSX.Element | null {
    const { label, required } = this.props;

    return (
      <>
        {label} {required && <Required />}
      </>
    );
  }

  private renderAlert(): JSX.Element | null {
    const { error } = this.props;

    if (error)
      return <Alert variant="danger">{error}</Alert>;

    return null;
  }

  protected abstract renderControl(): JSX.Element;

  private renderContent(): JSX.Element {
    return (
      <>
        {this.renderControl()}
        {this.renderAlert()}
      </>
    );
  }

  public render(): JSX.Element {
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
