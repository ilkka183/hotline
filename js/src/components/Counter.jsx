import React, { Component } from 'react';

export default class Counter extends Component {
  state = {
    count: 0,
    tags: ['tag1', 'tag2', 'tag3']
  }

  handleIncrement = () => {
    this.setState({ count: this.state.count + 1 });
  }

  formatCount() {
    const { count } = this.state;
    return count === 0 ? 'Zero' : count;
  }

  get bagdeClasses() {
    let classes = 'badge m-2 badge-';
    classes += this.state.count === 0 ? 'warning' : 'primary';
    return classes;
  }

  render() {
    return (
      <div>
        <span className={ this.bagdeClasses }>{ this.formatCount() }</span>
        <button className="btn btn-secondary btn-sm" onClick={ this.handleIncrement }>Increment</button>
        <ul>
          { this.state.tags.map(tag => <li key={tag}>{ tag }</li>) }
        </ul>
      </div>
    );
  }
}
