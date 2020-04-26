import React, { Component } from 'react';

export default class SearchBox extends Component {
  render() { 
    const { value, onChange } = this.props;

    return (
      <input
        type="text"
        name="query"
        className="form-control my-3"
        placeholder="Search..."
        value={value}
        onChange={e => onChange(e.currentTarget.value)}
      />
    );
  }
}
