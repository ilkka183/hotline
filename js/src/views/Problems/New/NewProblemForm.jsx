import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import RegistrationNumberPage from './RegistrationNumberPage'
import ProblemFormPage from './ProblemFormPage'
import SelectDataPage from './SelectDataPage'
import auth from '../../../services/authService';

function getFuelType(text) {
  switch (text) {
    case 'bensiini': return 0;
    case 'diesel': return 1;
    default: return 0;
  }
}

export default class NewProblemForm extends Component {
  state = {
    data: null,
    quidedStep: 0,
    manualStep: 0
  }

  handleSelect = (eventKey) => {
    this.setState({ data: null });

    let data = null;

    if (eventKey === 'manual') {
      data = {
        userId: auth.getCurrentUser().id,
        make: '',
        model: '',
        modelYear: '',
        registrationYear: '',
        registrationNumber: '',
        fuelType: '',
        power: '',
        cylinderCount: '',
        engineCode: '',
        engineSize: '',
        vin: '',
        netWeight: '',
        grossWeight: ''
      }
    }

    this.setState({ data });
  }

  handleRegistrationNumberSearch = (info) => {
    this.setState({ data: null });

    console.log(info);

    const data = {
      userId: auth.getCurrentUser().id,
      make: info.carMake,
      model: info.carModel,
      registrationYear: info.registrationYear,
      registrationNumber: info.registrationNumber,
      fuelType: getFuelType(info.fuelType),
      power: info.power,
      cylinderCount: info.cylinderCount,
      engineCode: info.engineCode,
      engineSize: info.engineSize,
      vin: info.vechileIdentificationNumber,
      netWeight: info.netWeight,
      grossWeight: info.grossWeight
    }

    this.setState({ data });

    console.log(data);
  }

  handleRegistrationNumberClear = () => {
    this.setState({ data: null });
  }

  handleQuidedPrev = () => {
    this.setState({ quidedStep: this.state.quidedStep - 1 });
  }

  handleQuidedNext = () => {
    this.setState({ quidedStep: this.state.quidedStep + 1 });
  }

  handleManualPrev = () => {
    this.setState({ manualStep: this.state.manualStep - 1 });
  }

  handleManualNext = () => {
    this.setState({ manualStep: this.state.manualStep + 1 });
  }

  handleSelectionSelected = (info) => {
    this.setState({ data: null });

    const data = {
      userId: auth.getCurrentUser().id,
      ...info
    }

    this.setState({ data });

    console.log(data);
  }

  handleSubmit = e => {
    this.props.history.goBack();
  }

  render() { 
    return (
      <Container>
        <h2>Lisää uusi vikatapaus</h2>
        <Tabs className="mb-2" defaultActiveKey="home" id="uncontrolled-tab-example" onSelect={this.handleSelect}>
          <Tab eventKey="select" title="Ohjattu syöttö">
            {this.state.quidedStep === 0 && <RegistrationNumberPage onNext={this.handleQuidedNext} />}
            {this.state.quidedStep === 1 && <SelectDataPage onPrev={this.handleQuidedPrev} onNext={this.handleQuidedNext} onSelected={this.handleSelectionSelected} />}
            {this.state.quidedStep === 2 && <ProblemFormPage onPrev={this.handleQuidedPrev} onNext={this.handleQuidedNext} data={this.state.data} showTitle={false} onSubmit={this.handleSubmit}/>}
          </Tab>
          <Tab eventKey="manual" title="Manuaalinen syöttö">
            {this.state.manualStep === 0 && <RegistrationNumberPage onNext={this.handleManualNext} />}
            {this.state.manualStep === 1 && <ProblemFormPage onPrev={this.handleManualPrev} />}
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
