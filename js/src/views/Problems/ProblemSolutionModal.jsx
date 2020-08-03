import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import ProblemForm from './ProblemForm';
import http from '../../services/httpService';

export default class ProblemSolutionModal extends Component {
  state = {
    problem: {},
    reply: {}
  }

  async componentDidMount() {
    const { problemId, replyId } = this.props;

    try {
      const { data: problem } = await http.get('/problems/open/' + problemId);
      const { data: reply } = await http.get('/problemreplies/' + replyId);

      problem.Solution = reply.Message;

      this.setState({ problem, reply });
    }
    catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace('/not-found');
    }
  }

  handleChange = ({ currentTarget }) => {
    const problem = {...this.state.problem}

    problem[currentTarget.name] = currentTarget.value;

    this.setState({ problem });
  }

  handleSubmit = async e => {
    e.preventDefault();

    const { onSubmit } = this.props;
    const { problem, reply } = this.state;

    await http.put('/problems/' + problem.Id, { Solution: problem.Solution, Status: 1 });
    await http.put('/problemreplies/' + reply.Id, { Solution: true });
    
    onSubmit();
  }

  renderSolution() {
    const { problem } = this.state;

    return (
      <Form.Group>
        <Form.Label>Ratkaisu</Form.Label>
        <Form.Control
          as="textarea"
          rows={10}
          name="Solution"
          value={problem.Solution}
          onChange={this.handleChange}
        />
      </Form.Group>          
    );
  }

  render() {
    const { showProblem, onHide } = this.props;
    const { problem } = this.state;

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
          {showProblem && <ProblemForm variant="table" data={problem} showTitle={false} />}
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
