import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import RegistrationNumber from './RegistrationNumber'
import ProblemFormPage from './ProblemFormPage'
import SelectData from './SelectData'
import TitlePage from './TitlePage'
import DescriptionPage from './DescriptionPage'
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

  constructor() {
    super();

    this.state.data = {
      UserId: auth.getCurrentUser().id,
      Make: '',
      Model: '',
      ModelYear: '',
      RegistrationYear: '',
      RegistrationNumber: '',
      FuelType: '',
      Power: '',
      CylinderCount: '',
      EngineCode: '',
      EngineSize: '',
      VIN: '',
      NetWeight: '',
      GrossWeight: '',
      Title: '',
      Description: '',
      Status: 0
    }
  }

  handleRegistrationNumberFound = (info) => {
    const data = {...this.state.data}

    data.Make = info.carMake;
    data.Model = info.carModel;
    data.RegistrationYear = info.registrationYear;
    data.RegistrationNumber = info.registrationNumber;
    data.FuelType = getFuelType(info.fuelType);
    data.EnginePower = info.power;
    data.CylinderCount = info.cylinderCount;
    data.EngineCode = info.engineCode;
    data.EngineSize = info.engineSize;
    data.VIN = info.vechileIdentificationNumber;
    data.NetWeight = info.netWeight;
    data.GrossWeight = info.grossWeight;

    this.setState({ data });
  }

  handleDataSelected = (info) => {
    const data = {...this.state.data}

    data.Make = info.make;
    data.Model = info.model;
    data.ModelYear = info.modelYear;
    data.FuelType = info.fuelType;
    data.EngineSize = info.engineSize;
    data.EnginePower = info.enginePower;
    data.EngineCode = info.engineCode;

    const quidedStep = 2;

    this.setState({ data, quidedStep });
  }

  handleInputChange = ({ currentTarget: input }) => {
    const data = {...this.state.data}

    data[input.name] = input.value;

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
        <SelectData
          onSelected={this.handleDataSelected}
        />
      </>
    );
  }

  renderQuidedTitle() {
    return (
      <TitlePage
        data={this.state.data}
        onChange={this.handleInputChange}
        onNext={this.handleQuidedNext}
      />
    );
  }

  renderQuidedDescription() {
    return (
      <DescriptionPage
        data={this.state.data}
        onChange={this.handleInputChange}
        onPrev={this.handleQuidedPrev}
        onNext={this.handleQuidedNext}
      />
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
          onSubmitted={this.handleProblemFormSubmitted}
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
            {this.state.quidedStep === 3 && this.renderQuidedDescription()}
            {this.state.quidedStep === 4 && this.renderQuidedProblemForm()}
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
