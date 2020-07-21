import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import queryString from 'query-string';
import ProblemForm from './ProblemForm';
import http from '../../services/httpService';

export default class ProblemSolutionForm extends Component {
  state = {
    problem: {},
    reply: {}
  }

  constructor(props) {
    super(props);

    this.replyId = queryString.parse(this.props.location.search).ReplyId;
  }

  get problemId() {
    return this.props.match.params.id;
  }

  async componentDidMount() {
    try {
      const { data: problem } = await http.get('/problems/open/' + this.problemId);
      const { data: reply } = await http.get('/problemreplies/' + this.replyId);

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

    const { problem, reply } = this.state;

    await http.put('/problems/' + problem.Id, { Solution: problem.Solution, Status: 1 });
    await http.put('/problemreplies/' + reply.Id, { Solution: true });
    
    this.goBack();
  }

  goBack() {
    const { history } = this.props;
    
    if (history)
      history.goBack();
  }

  renderSolution() {
    const { problem } = this.state;

    return (
      <Form.Group>
        <h4>Ratkaisu</h4>
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
    const { problem } = this.state;

    return (
      <Container>
        <h2>Vikatapauksen ratkaisu</h2>
        <ProblemForm data={problem} asTable={true} showTitle={false} />
        <Form onSubmit={this.handleSubmit}>
          {this.renderSolution()}
          <Button className="mr-2" variant="primary" type="submit" disabled={!problem.Solution}>Tallenna</Button>
        </Form>
      </Container>
    );
  }
}
