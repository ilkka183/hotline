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

class Lines {
  private lines: string = '';
  private index: number = 0;

  public get toString(): string {
    return this.lines;
  }

  public addText(title: string, text: string): void {
    if (this.index > 0)
      this.lines += '\n\n';

    this.lines += title;
    this.lines += '\n';
    this.lines += text;

    this.index++;
  }

  public addTexts(title: string, flags: any[], texts: string[]): void {
    if (this.index > 0)
      this.lines += '\n\n';

    this.lines += title;

    for (let i = 0; i < flags.length; i++)
      if (flags[i]) {
        this.lines += '\n';
        this.lines += texts[i];
      }

      this.index++;
  }
}

interface Props {
  onSubmit: () => void,
  onHide: () => void
}

interface State {
  activeKey: any,
  step: number,
  stepReady: boolean[],
  data: any,
  options: {
    makes: any,
    modelYears: any,
    fuelTypes: any,
    models: any,
    engineSizes: any,
    engineTypes: any,
    engineType: any
  },
  title: any,
  description: any
}

export default class NewProblemForm extends Component<Props, State> {
  private user: any = auth.getCurrentUser();

  public state: State = {
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

  constructor(props: any) {
    super(props);

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
    options.makes = data.map((value: any) => ({ value, text: value }));

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
      default: return false;
    }
  }

  handleData = (data: any) => {
    this.setState({ data });
  }

  handleOptions = (options: any) => {
    this.setState({ options });
  }

  handleTabSelect = (activeKey: any) => {
    this.setState({ activeKey });
  }

  handleTitleChange = ({ currentTarget: input }: any) => {
    const title = {...this.state.title}

    title[input.name] = input.value;

    this.setState({ title });
  }

  handleDescriptionChange = ({ currentTarget: target }: any) => {
    const description = {...this.state.description}

    description[target.name] = target.value;

    this.setState({ description });
  }

  handleDescriptionChangeCheckboxGroup = ({ currentTarget: target }: any) => {
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
      const lines = new Lines();

      const { description, appearance, diagnostic, testers, history, text } = this.state.description;

      if (description)
        lines.addText('Asiakkaan viankuvaus:', description);

      if (appearance)
        lines.addText('Vian esiintyminen:', appearance);

      if (diagnostic)
        lines.addText('Itsediagnostiikka:', diagnostic);

      if (testers)
        lines.addTexts('Käytettyt testilaitteet:', testers, TESTERS);

      if (history)
        lines.addText('Korjaushistoria:', history);

      if (text)
        lines.addText('Vapaa teksti:', text);

      const data: any = {...this.state.data}
      data.Description = lines.toString;

      this.setState({ data });
    }
  }

  handleSubmit = () => {
    const { onSubmit }: any = this.props;

    try {
      (this.refs.problemForm as any).handleSubmit();
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
          onSubmitted={this.handleSubmit}
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
