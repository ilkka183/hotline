import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FieldSelect from './FieldSelect';
import { FUELS } from '../../schemas/ProblemsSchema';


export default class SelectVehicleForm extends Component {
  state = {
    brand: '',
    modelYear: '',
    fuel: '',
    model: '',
    engineSize: ''
  }

  handleChange = ({ currentTarget: select }) => {
    const state = {...this.state};
    state[select.name] = select.value;

    if (['brand'].includes(select.name))
      state.modelYear = '';

    if (['brand', 'modelYear'].includes(select.name))
      state.fuel = '';

    if (['brand', 'modelYear', 'fuel'].includes(select.name))
      state.model = '';

    if (['brand', 'modelYear', 'fuel', 'model'].includes(select.name))
      state.engineSize = '';

    this.setState(state);
  }

  handleClear = () => {
    const state = {...this.state};

    for (const name in state)
      state[name] = '';

    this.setState(state);
  }

  handleSubmit = e => {
    e.preventDefault();

    console.log(this.state);
  }

  brands() {
    return ['Audi', 'Ford', 'Seat', 'Volkswagen'];
  }

  modelYears() {
    return [2015, 2016, 2017, 2018, 2019, 2020];
  }

  fuels() {
    return FUELS;
  }

  models() {
    switch (this.state.brand) {
      case 'Ford': return ['Ka', 'Fiesta', 'Focus', 'Mondeo'];
      case 'Seat': return ['Mii', 'Ibiza', 'Leon', 'Ateca'];
      default: return ['Tuntematon malli'];
    }
  }

  engineSizes() {
    return [999, 1399, 1499, 1599, 1999];
  }

  render() {
    const { brand, modelYear, fuel, model, engineSize } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <FieldSelect name="brand" placeholder="Valitse merkki" value={brand} values={this.brands()} onChange={this.handleChange} />
        {brand && <FieldSelect name="modelYear" placeholder="Valitse mallivuosi" value={modelYear} values={this.modelYears()} onChange={this.handleChange} />}
        {modelYear && <FieldSelect name="fuel" placeholder="Valitse käyttövoima" value={fuel} values={this.fuels()} onChange={this.handleChange} />}
        {fuel && <FieldSelect name="model" placeholder="Valitse malli" value={model} values={this.models()} onChange={this.handleChange} />}
        {model && <FieldSelect name="engineSize" placeholder="Valitse moottorin koko" value={engineSize} values={this.engineSizes()} onChange={this.handleChange} />}
        <Button className="mb-2 mr-sm-2" type="submit">Jatka</Button>
        <Button className="mb-2 mr-sm-2" onClick={this.handleClear}>Tyhjennä</Button>
      </Form>
    );
  }
}
