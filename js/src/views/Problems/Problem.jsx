import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import ProblemRepliesTable from './ProblemRepliesTable'
import ProblemAttachmentsTable from './ProblemAttachmentsTable'
import LinkButton from '../../components/common/LinkButton';
import http from '../../services/httpService';
import ProblemForm from './ProblemForm';
import auth from '../../services/authService';

export default class Problem extends Component {
  user = auth.getCurrentUser();

  state = {
    problem: {}
  }

  get problemId() {
    return this.props.match.params.id;
  }

  async componentDidMount() {
    try {
      const { data: problem } = await http.get('/problems/open/' + this.problemId);

      this.setState({ problem });
    }
    catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace('/not-found');
    }
  }

  render() {
    const { problem } = this.state;

    const style = {
      marginBottom: 10
    }

    const editable = problem.UserId === this.user.id || this.user.role === 0;

    return (
      <Container>
        <h2>Vikatapaus</h2>
        {editable && <LinkButton style={style} to={'/problems/' + this.problemId}>Muokkaa</LinkButton>}
        <ProblemForm asTable={true} showTitle={false} dataId={this.problemId} />
        <br />
        {problem.Id &&
          <>
            <ProblemAttachmentsTable
              problemId={problem.Id}
              showSearchBox={false}
              autoHide={true}
              readOnly={true}
            />
            <ProblemRepliesTable
              problemId={problem.Id}
              showSearchBox={false}
            />
          </>}
    </Container>
    );
  }
}
