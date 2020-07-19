import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import ProblemForm from '../ProblemForm'

export default class ManualRegistrationNumberPage extends Component {
  render() { 
    const { data, onSubmitted } = this.props;

    return (
      <>
        <Button className="mt-2 mb-2" onClick={this.props.onPrev}>Edellinen</Button>
        <h4>Syötä ajoneuvon tiedot ja vian kuvaus</h4>
        <ProblemForm data={data} showTitle={false} onSubmitted={onSubmitted} />
      </>
    );
  }
}
