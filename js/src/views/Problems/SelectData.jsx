import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FieldSelect from './FieldSelect';
import { FUEL_TYPES } from './ProblemsTable';


export default class SelectVehicleForm extends Component {
  state = {
    data: {
      make: '',
      modelYear: '',
      fuelType: '',
      model: '',
      engineSize: ''
    }
  }

  handleChange = ({ currentTarget: select }) => {
    const data = {...this.state.data};
    data[select.name] = select.value;

    if (['make'].includes(select.name))
      data.modelYear = '';

    if (['make', 'modelYear'].includes(select.name))
      data.fuelType = '';

    if (['make', 'modelYear', 'fuelType'].includes(select.name))
      data.model = '';

    if (['make', 'modelYear', 'fuelType', 'model'].includes(select.name))
      data.engineSize = '';

    this.setState({ data });
  }

  handleClear = () => {
    const data = {...this.state.data};

    for (const name in data)
      data[name] = '';

    this.setState({ data });
  }

  handleSubmit = e => {
    e.preventDefault();

    const { data } = this.state;
    data.fuelType = FUEL_TYPES.indexOf(data.fuelType);

    console.log(data);

    this.props.onSelected(data);
  }

  makes() {
    return ['Audi', 'Ford', 'Seat', 'Volkswagen'];
  }

  modelYears() {
    return [2015, 2016, 2017, 2018, 2019, 2020];
  }

  fuelTypes() {
    return FUEL_TYPES;
  }

  models() {
    switch (this.state.data.make) {
      case 'Ford': return ['Ka', 'Fiesta', 'Focus', 'Mondeo'];
      case 'Seat': return ['Mii', 'Ibiza', 'Leon', 'Ateca'];
      default: return ['Tuntematon malli'];
    }
  }

  engineSizes() {
    return [999, 1399, 1499, 1599, 1999];
  }

  render() {
    const { make, modelYear, fuelType, model, engineSize } = this.state.data;

    return (
      <Form onSubmit={this.handleSubmit}>
        <FieldSelect name="make" placeholder="Valitse merkki" value={make} values={this.makes()} onChange={this.handleChange} />
        {make && <FieldSelect name="modelYear" placeholder="Valitse mallivuosi" value={modelYear} values={this.modelYears()} onChange={this.handleChange} />}
        {modelYear && <FieldSelect name="fuelType" placeholder="Valitse käyttövoima" value={fuelType} values={this.fuelTypes()} onChange={this.handleChange} />}
        {fuelType && <FieldSelect name="model" placeholder="Valitse malli" value={model} values={this.models()} onChange={this.handleChange} />}
        {model && <FieldSelect name="engineSize" placeholder="Valitse moottorin koko" value={engineSize} values={this.engineSizes()} onChange={this.handleChange} />}
        <Button className="mb-2 mr-sm-2" type="submit" disabled={!engineSize}>Jatka</Button>
        <Button className="mb-2 mr-sm-2" disabled={!make} onClick={this.handleClear}>Tyhjennä</Button>
      </Form>
    );
  }
}
