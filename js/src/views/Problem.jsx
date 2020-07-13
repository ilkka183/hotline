import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import ProblemReplies from './ProblemReplies'
import { DateTimeField } from '../schemas/Schema';
import http from '../services/httpService';
import { FUELS, STATUSES } from '../schemas/ProblemSchema';
import { apiUrl } from '../config.json';

export default class Problem extends Component {
  state = {
    problem: {}
  }

  async componentDidMount() {
    try {
      const { data: problem } = await http.get(apiUrl + '/problems/open/' + this.props.match.params.id);

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
            <tr><td>Rekisterinumero</td><td>{problem.LicenseNumber}</td></tr>
            <tr><td>Merkki</td><td>{problem.Brand}</td></tr>
            <tr><td>Malli</td><td>{problem.Model}</td></tr>
            <tr><td>Vuosimalli</td><td>{problem.ModelYear}</td></tr>
            <tr><td>Käyttövoima</td><td>{FUELS[problem.Fuel]}</td></tr>
            <tr><td>Tila</td><td>{STATUSES[problem.Status]}</td></tr>
          </tbody>
        </Table>
        <h4>{problem.Title}</h4>
        <div>{problem.Description}</div>
        <br />
        {problem.Id && <ProblemReplies problemId={problem.Id}/>}
      </Container>
    );
  }
}
