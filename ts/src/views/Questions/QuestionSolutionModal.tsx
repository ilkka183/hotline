import React from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import QuestionForm from './QuestionForm';
import http from '../../services/httpService';
import { QuestionStatus } from './Question';

interface Props {
  showQuestion: boolean,
  questionId: number,
  answerId: number | null,
  onSubmit: () => void,
  onHide: () => void
}

interface State {
  question: any,
  answer: any
}

export default class QuestionSolutionModal extends React.Component<Props, State> {
  public state: State = {
    question: {},
    answer: {}
  }

  async componentDidMount() {
    const { questionId, answerId } = this.props;

    try {
      const { data: question } = await http.get('/questions/open/' + questionId);
      const { data: answer } = await http.get('/answers/' + answerId);

      question.Solution = answer.Message;

      this.setState({ question, answer });
    }
    catch (ex) {
      if (ex.response && ex.response.status === 404) {
//        this.props.history.replace('/not-found');
      }
    }
  }

  private readonly handleChange = ({ currentTarget }: any) => {
    const question = {...this.state.question}

    question[currentTarget.name] = currentTarget.value;

    this.setState({ question });
  }

  private readonly handleSubmit = async (event: any) => {
    event.preventDefault();

    const { onSubmit } = this.props;
    const { question, answer } = this.state;

    await http.put('/questions/' + question.Id, { Solution: question.Solution, Status: QuestionStatus.Solved });
    await http.put('/answers/' + answer.Id, { Solution: true });
    
    onSubmit();
  }

  private renderSolution(): JSX.Element {
    const { question } = this.state;

    return (
      <Form.Group>
        <Form.Label>Ratkaisu</Form.Label>
        <Form.Control
          as="textarea"
          rows={10}
          name="Solution"
          value={question.Solution}
          onChange={this.handleChange}
        />
      </Form.Group>          
    );
  }

  public render(): JSX.Element {
    const { showQuestion, onHide } = this.props;
    const { question } = this.state;

    return (
      <Modal
        size="xl"
        backdrop="static"
        show={true}
        onHide={onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title>Vikatapauksen ratkaisu</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {showQuestion && <QuestionForm variant="table" data={question} showTitle={false} />}
          {this.renderSolution()}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={this.handleSubmit}>Tallenna</Button>
          <Button variant="secondary" onClick={onHide}>Peru</Button>
        </Modal.Footer>
      </Modal>      
    );
  }
}
