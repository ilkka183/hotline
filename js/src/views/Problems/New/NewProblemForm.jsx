import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import RegistrationNumber from './RegistrationNumber'
import ProblemFormPage from './ProblemFormPage'
import SelectData from './SelectData'
import TitlePage from './TitlePage'
import ProblemForm from '../ProblemForm'
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

  handleRegistrationNumberFound = (info) => {
    const data = {
      UserId: auth.getCurrentUser().id,
      Make: info.carMake,
      Model: info.carModel,
      RegistrationYear: info.registrationYear,
      RegistrationNumber: info.registrationNumber,
      FuelType: getFuelType(info.fuelType),
      Power: info.power,
      CylinderCount: info.cylinderCount,
      EngineCode: info.engineCode,
      EngineSize: info.engineSize,
      VIN: info.vechileIdentificationNumber,
      NetWeight: info.netWeight,
      GrossWeight: info.grossWeight,
      Status: 0
    }

    console.log(data);

    this.setState({ data });
  }

  handleManualRegistrationNumberFound = (info) => {
    this.handleRegistrationNumberFound(info);
    this.setState({ manualStep: 1 });
  }

  handleQuidedRegistrationNumberFound = (info) => {
    this.handleRegistrationNumberFound(info);
    this.setState({ quidedStep: 2 });
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

    const quidedStep = 2;

    console.log(data);

    this.setState({ data, quidedStep });
  }

  handleProblemFormSubmitted = () => {
    this.props.history.goBack();
  }

  renderQuidedRegistrationNumber() {
    return (
      <RegistrationNumber
        onFound={this.handleQuidedRegistrationNumberFound}
        onNext={this.handleQuidedNext}
      />
    );
  }

  renderQuidedSelectData() {
    return (
      <>
        <h4>Valitse ajoneuvon tiedot</h4>
        <SelectData onSelected={this.handleSelectionSelected} />
      </>
    );
  }

  renderQuidedTitle() {
    return (
      <TitlePage onPrev={this.handleQuidedPrev} onNext={this.handleQuidedNext} />
    );
  }

  renderQuidedProblemForm() {
    return (
      <ProblemFormPage
        data={this.state.data}
        onPrev={this.handleQuidedPrev}
        onSubmitted={this.handleProblemFormSubmitted}
      />
    );
  }

  renderManualRegistrationNumber() {
    return (
      <RegistrationNumber
        onFound={this.handleManualRegistrationNumberFound}
        onNext={this.handleManualNext}
      />
    );
  }

  renderManualProblemForm() {
    return (
      <>
        <h4>Syötä ajoneuvon tiedot sekä kuvaile vikatapaus</h4>
        <ProblemForm
          data={this.state.data}
          showTitle={false}
          onSubmitted={this.handleSubmitted}
        />
      </>
    );
  }

  render() {
    return (
      <Container>
        <h2>Lisää uusi vikatapaus</h2>
        <Tabs className="mb-2" defaultActiveKey="home" id="uncontrolled-tab-example" onSelect={this.handleSelect}>
          <Tab eventKey="select" title="Ohjattu syöttö">
            {this.state.quidedStep === 0 && this.renderQuidedRegistrationNumber()}
            {this.state.quidedStep === 1 && this.renderQuidedSelectData()}
            {this.state.quidedStep === 2 && this.renderQuidedTitle()}
            {this.state.quidedStep === 3 && this.renderQuidedProblemForm()}
          </Tab>
          <Tab eventKey="manual" title="Manuaalinen syöttö">
            {this.state.manualStep === 0 && this.renderManualRegistrationNumber()}
            {this.state.manualStep === 1 && this.renderManualProblemForm()}
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
