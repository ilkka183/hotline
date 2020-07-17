import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import ProblemRepliesTable from './ProblemRepliesTable'
import ProblemAttachmentsTable from './ProblemAttachmentsTable'
import { DateTimeField } from '../../components/common/Fields';
import http from '../../services/httpService';
import { FUEL_TYPES, STATUSES } from './ProblemsTable';

export default class Problem extends Component {
  state = {
    problem: {}
  }

  async componentDidMount() {
    try {
      const { data: problem } = await http.get('/problems/open/' + this.props.match.params.id);

      this.setState({ problem });
    }
    catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace('/not-found');
    }
  }

  render() {
    const { problem } = this.state;

    return (
      <Container>
        <h2>Vikatapaus</h2>
        <Table size="sm" borderless>
          <tbody>
            <tr><td>No</td><td>{problem.Id}</td></tr>
            <tr><td>Pvm</td><td>{DateTimeField.toString(problem.Date)}</td></tr>
            <tr><td>Lähettäjä</td><td>{problem.UserName}</td></tr>
            <tr><td>Rekisteröintivuosi</td><td>{problem.RegistrationYear}</td></tr>
            <tr><td>Rekisterinumero</td><td>{problem.RegistrationNumber}</td></tr>
            <tr><td>Merkki</td><td>{problem.Make}</td></tr>
            <tr><td>Malli</td><td>{problem.Model}</td></tr>
            <tr><td>Vuosimalli</td><td>{problem.ModelYear}</td></tr>
            <tr><td>Käyttövoima</td><td>{FUEL_TYPES[problem.FuelType]}</td></tr>
            <tr><td>Tila</td><td>{STATUSES[problem.Status]}</td></tr>
          </tbody>
        </Table>
        <h4>{problem.Title}</h4>
        <div>{problem.Description}</div>
        <br />
        {problem.Id &&
          <>
            {true && <ProblemAttachmentsTable
              problemId={problem.Id}
              showSearchBox={false}
            />}
            <ProblemRepliesTable
              problemId={problem.Id}
              showSearchBox={false}
            />
          </>}
    </Container>
    );
  }
}
