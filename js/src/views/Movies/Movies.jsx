import React, { Component } from 'react';
import TableView from '../TableView';

export default class Movies extends Component {
  columns = [
    { name: 'Title',           title: 'Title', link: movie => '/movies/' + movie.Id },
    { name: 'GenreName',       title: 'Genre' },
    { name: 'NumberInStock',   title: 'Stock' },
    { name: 'DailyRentalRate', title: 'Rate' },
  ];

  render() {
    return (
      <TableView
        columns={this.columns}
        title="Movies"
        restName="movies"
      />
    );
  }
}
