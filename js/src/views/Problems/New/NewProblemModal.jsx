import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import SearchData from './SearchData'
import SelectData from './SelectData'
import EnterData from './EnterData'
import ComposeTitle, { GROUPS } from './ComposeTitle'
import ComposeDescription, { TESTERS } from './ComposeDescription'
import ProblemForm from '../ProblemForm'
import auth from '../../../services/authService';
import http from '../../../services/httpService';

export default class NewProblemForm extends Component {
  user = auth.getCurrentUser();

  state = {
    activeKey: undefined,
    step: 0,
    stepReady: [false, false, false, false],
    data: null,
    options: {
      makes: null,
      modelYears: null,
      fuelTypes: null,
      models: null,
      engineSizes: null,
      engineTypes: null,
      engineType: null
    },
    title: null,
    description: null
  }

  constructor() {
    super();

    this.state.data = {
      UserId: this.user.id,
      Make: '',
      Model: '',
      ModelYear: '',
      RegistrationYear: '',
      RegistrationNumber: '',
      FuelType: '',
      CylinderCount: '',
      EngineSize: '',
      EnginePower: '',
      EngineCode: '',
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

    const testers = [];

    for (let i = 0; i < TESTERS.length; i++)
      testers.push(false);

    this.state.description = {
      description: '',
      appearance: '',
      appearanceFrequency: '',
      diagnostic: '',
      diagnosticCodes: '',
      testers,
      testerOther: '',
      history: '',
      text: ''
    }
  }

  async componentDidMount() {
    const { data } = await http.get('/data/makes');

    const options = {...this.state.options};
    options.makes = data.map(value => ({ value, text: value }));

    this.setState({ options });
  }

  isDataReady() {
    const { data } = this.state;

    return data.Make;
  }

  isTitleReady() {
    const { title } = this.state;

    return title &&
      title.group &&
      (title.group !== GROUPS[GROUPS.length - 1] || title.groupOther) &&
      title.title;
  }

  isDescriptionReady() {
    const { description } = this.state;

    return description.description;
  }

  isProblemReady() {
    return true;
  }

  isStepReady() {
    const { step } = this.state;

    switch (step) {
      case 0: return this.isDataReady();
      case 1: return this.isTitleReady();
      case 2: return this.isDescriptionReady();
      case 3: return this.isProblemReady();
    }

    return false;
  }

  handleData = (data) => {
    this.setState({ data });
  }

  handleOptions = (options) => {
    this.setState({ options });
  }

  handleTabSelect = (activeKey) => {
    this.setState({ activeKey });
  }

  handleTitleChange = ({ currentTarget: input }) => {
    const title = {...this.state.title}

    title[input.name] = input.value;

    this.setState({ title });
  }

  handleDescriptionChange = ({ currentTarget: target }) => {
    const description = {...this.state.description}

    description[target.name] = target.value;

    this.setState({ description });
  }

  handleDescriptionChangeCheckboxGroup = ({ currentTarget: target }) => {
    const description = {...this.state.description}

    description[target.name][target.id - 1] = target.checked;

    console.log(description);

    this.setState({ description });
  }

  handlePrev = () => {
    const step = this.state.step - 1;

    this.setState({ step });
  }

  handleNext = () => {
    const step = this.state.step + 1;

    this.setState({ step });

    if (step === 2) {
      const { group, groupOther, title } = this.state.title;

      const data = {...this.state.data}
      const groupName = (group === GROUPS[GROUPS.length - 1]) ? groupOther : group;
      data.Title = groupName.toUpperCase() + ': ' + title;

      this.setState({ data });
    }
    else if (step === 3) {
      let lines = '';
      let index = 0;

      const { description, appearance, diagnostic, testers, history, text } = this.state.description;

      if (description)
        addText('Asiakkaan viankuvaus:', description);

      if (appearance)
        addText('Vian esiintyminen:', appearance);

      if (diagnostic)
        addText('Itsediagnostiikka:', diagnostic);

      if (testers)
        addTexts('Käytettyt testilaitteet:', testers, TESTERS);

      if (history)
        addText('Korjaushistoria:', history);

      if (text)
        addText('Vapaa teksti:', text);

      const data = {...this.state.data}
      data.Description = lines;

      this.setState({ data });

      function addText(title, text) {
        if (index > 0)
          lines += '\n\n';

        lines += title;
        lines += '\n';
        lines += text;

        index++;
      }

      function addTexts(title, flags, texts) {
        if (index > 0)
          lines += '\n\n';

        lines += title;

        for (let i = 0; i < flags.length; i++)
          if (flags[i]) {
            lines += '\n';
            lines += texts[i];
          }

        index++;
      }
    }
  }

  handleSubmit = () => {
    const { onSubmit } = this.props;

    try {
      this.refs.problemForm.handleSubmit();
      onSubmit();
    }
    catch (ex) {
    }
  }

  renderData() {
    const searchKey = 'searchData';
    const selectKey = 'selectData';
    const enterKey = 'enterData';

    return (
      <Tabs defaultActiveKey={searchKey} activeKey={this.state.activeKey} onSelect={this.handleTabSelect}>
        <Tab eventKey={searchKey} title="Hae ajoneuvon tiedot">
          <SearchData
            data={this.state.data}
            onData={this.handleData}
          />
        </Tab>
        <Tab eventKey={selectKey} title="Valitse ajoneuvon tiedot">
          <SelectData
            data={this.state.data}
            onData={this.handleData}
            options={this.state.options}
            onOptions={this.handleOptions}
          />
        </Tab>
        <Tab eventKey={enterKey} title="Syötä ajoneuvon tiedot">
          <EnterData
            data={this.state.data}
            onData={this.handleData}
          />
        </Tab>
      </Tabs>
    );
  }

  renderTitle() {
    return (
      <ComposeTitle
        data={this.state.data}
        title={this.state.title}
        onChange={this.handleTitleChange}
      />
    );
  }

  renderDescription() {
    return (
      <ComposeDescription
        data={this.state.data}
        description={this.state.description}
        onChange={this.handleDescriptionChange}
        onChangeCheckboxGroup={this.handleDescriptionChangeCheckboxGroup}
      />
    );
  }

  renderProblemForm() {
    return (
      <>
        <h3>Syötä ajoneuvon tiedot ja vian kuvaus</h3>
        <ProblemForm
          ref="problemForm"
          defaultData={this.state.data}
          showTitle={false}
          showSubmitButton={false}
          onPrev={this.handlePrev}
          onSubmitted={this.handleProblemFormSubmitted}
        />
      </>
    );
  }

  render() {
    const { onHide } = this.props;
    const { step } = this.state;

    return (
      <Modal
        size="xl"
        backdrop="static"
        show={true}
        onHide={onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title>Lisää uusi vikatapaus</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {step === 0 && this.renderData()}
          {step === 1 && this.renderTitle()}
          {step === 2 && this.renderDescription()}
          {step === 3 && this.renderProblemForm()}
        </Modal.Body>

        <Modal.Footer>
          <div className="mr-auto" >
            {(step > 0) && <Button variant="primary" className="mr-2" onClick={this.handlePrev}>Edellinen</Button>}
            {(step < 3) && <Button variant="primary" disabled={!this.isStepReady()} onClick={this.handleNext}>Seuraava</Button>}
          </div>
          {(step === 3) && <Button variant="primary" onClick={this.handleSubmit}>Tallenna</Button>}
          <Button variant="secondary" onClick={onHide}>Peru</Button>
        </Modal.Footer>
      </Modal>      
    );
  }
}
