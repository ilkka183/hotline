import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import ProblemForm from '../ProblemForm'

export default class ManualRegistrationNumberPage extends Component {
  render() { 
    const { data, onSubmitted } = this.props;

    return (
      <>
        <Button className="mb-2" onClick={this.props.onPrev}>Edellinen</Button>
        <h3>Syötä ajoneuvon tiedot ja vian kuvaus</h3>
        <ProblemForm data={data} showTitle={false} onSubmitted={onSubmitted} />
      </>
    );
  }
}
