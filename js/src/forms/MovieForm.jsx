import React, { Component } from 'react';

export default class MovieForm extends Component {
  render() {
    return (
      <div>
        <h1>Movie - {this.props.match.params.id}</h1>
        <button className="btn btn-primary" onClick={() => this.props.history.push('/movies')}>Save</button>
      </div>
    );
  }
}
