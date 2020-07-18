import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import SelectData from './SelectData'

export default class QuidedSelectDataPage extends Component {
  render() { 
    return (
      <>
        <Button className="mb-2 mr-sm-2" onClick={this.props.onPrev}>Edellinen</Button>
        <Button className="mb-2" onClick={this.props.onNext}>Seuraava</Button>
        <h3>Syötä ajoneuvon tiedot ja vian kuvaus</h3>
        <SelectData showTitle={false} onSubmit={this.handleSubmit}/>
      </>
    );
  }
}
