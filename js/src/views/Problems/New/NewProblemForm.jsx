import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import RegistrationNumber from './RegistrationNumber'
import ProblemFormPage from './ProblemFormPage'
import SelectData from './SelectData'
import CompositionTitle from './CompositionTitle'
import CompositionDescription from './CompositionDescription'
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
    title: null,
    description: null,
    compositionStep: 0,
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
    };

    this.state.title = {
      group: '',
      groupOther: '',
      title: ''
    }

    this.state.description = {
      description: ''
    }
  }

  handleRegistrationNumber = (info) => {
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

    const compositionStep = 2;

    this.setState({ data, compositionStep });
  }

  handleTitleChange = ({ currentTarget: input }) => {
    const title = {...this.state.title}

    title[input.name] = input.value;

    console.log(title);

    this.setState({ title });
  }

  handleDescriptionChange = ({ currentTarget: input }) => {
    const description = {...this.state.description}

    description[input.name] = input.value;

    this.setState({ description });
  }

  handleManualRegistrationNumber = (info) => {
    this.handleRegistrationNumber(info);

    this.setState({ manualStep: 1 });
  }

  handleCompositionRegistrationNumber = (info) => {
    this.handleRegistrationNumber(info);

    this.setState({ compositionStep: 2 });
  }

  handleCompositionPrev = () => {
    const compositionStep = this.state.compositionStep - 1;

    console.log('next');

    this.setState({ compositionStep });
  }

  handleCompositionNext = () => {
    const compositionStep = this.state.compositionStep + 1;
    
    this.setState({ compositionStep });
  }

  handleManualPrev = () => {
    const manualStep = this.state.manualStep - 1;

    this.setState({ manualStep });
  }

  handleManualNext = () => {
    const manualStep = this.state.manualStep + 1;

    this.setState({ manualStep });
  }

  handleProblemFormSubmitted = () => {
    this.props.history.goBack();
  }

  renderCompositionRegistrationNumber() {
    return (
      <RegistrationNumber
        onFound={this.handleCompositionRegistrationNumber}
        onNext={this.handleCompositionNext}
      />
    );
  }

  renderCompositionSelectData() {
    return (
      <>
        <h4>Valitse ajoneuvon tiedot</h4>
        <SelectData
          onSelected={this.handleDataSelected}
        />
      </>
    );
  }

  renderCompositionTitle() {
    return (
      <CompositionTitle
        data={this.state.data}
        title={this.state.title}
        onChange={this.handleTitleChange}
        onNext={this.handleCompositionNext}
      />
    );
  }

  renderCompositionDescription() {
    return (
      <CompositionDescription
        data={this.state.data}
        description={this.state.description}
        onChange={this.handleDescriptionChange}
        onPrev={this.handleCompositionPrev}
        onNext={this.handleCompositionNext}
      />
    );
  }

  renderCompositionProblemForm() {
    return (
      <ProblemFormPage
        data={this.state.data}
        onPrev={this.handleCompositionPrev}
        onSubmitted={this.handleProblemFormSubmitted}
      />
    );
  }

  renderManualRegistrationNumber() {
    return (
      <RegistrationNumber
        onFound={this.handleManualRegistrationNumber}
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
          <Tab eventKey="composition" title="Ohjattu syöttö">
            {this.state.compositionStep === 0 && this.renderCompositionRegistrationNumber()}
            {this.state.compositionStep === 1 && this.renderCompositionSelectData()}
            {this.state.compositionStep === 2 && this.renderCompositionTitle()}
            {this.state.compositionStep === 3 && this.renderCompositionDescription()}
            {this.state.compositionStep === 4 && this.renderCompositionProblemForm()}
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
