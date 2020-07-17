import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'

export default class FieldSelect extends Component {
  state = {
    values: []
  }

  async componentDidMount() {
    const values = await this.props.getValues();

    this.setState({ values });
  }

  render() {
    const { name, placeholder, value, onChange } = this.props;

    return (
      <Form.Control
        as="select"
        className="mb-2 mr-sm-2"
        name={name}
        value={value}
        onChange={onChange}
      >
        <option value={''}>{placeholder}</option>
        {this.state.values.map(item => <option key={item} value={item}>{item}</option>)}
      </Form.Control>
    );
  }
}
