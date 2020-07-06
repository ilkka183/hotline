import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Button from 'react-bootstrap/Button'
import DataPagination from './DataPagination';
import SearchBox from './SearchBox';
import { paginate } from '../../utils/paginate';

export default class DataTable extends Component {
  state = {
    data: [],
    searchQuery: '',
    currentPage: 1,
    pageSize: 4,
    sortColumn: {
      name: '',
      order: 'asc'
    }
  }

  async componentDidMount() {
    const { http, apiEndpoint } = this.props;
    const { data } = await http.get(apiEndpoint);

    this.setState({ data });
  }

  handleDelete = async item => {
    const { http, apiEndpoint } = this.props;
    await http.delete(apiEndpoint + '/' + item.Id);

    const data = this.state.data.filter(m => m.Id !== item.Id);

    this.setState({ data });
  }

  handleSearch = query => {
    this.setState({ searchQuery: query, currentPage: 1 });
  }

  handlePageChange = page => {
    this.setState({ currentPage: page });
  }

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  }

  setSorColumn(name) {
    const newSortColumn = {...this.state.sortColumn}

    if (newSortColumn.name === name)
      newSortColumn.order = (newSortColumn.order === 'asc') ? 'desc' : 'asc';
    else {
      newSortColumn.name = name;
      newSortColumn.order = 'asc';
    }

    this.handleSort(newSortColumn);
  }

  getPagedData(data) {
    const { searchQuery, sortColumn, currentPage, pageSize } = this.state;

    let filteredItems = data;

    if (searchQuery)
      filteredItems = data.filter(m => m.Title.toLowerCase().startsWith(searchQuery.toLowerCase()));

    const sortedItems = _.orderBy(filteredItems, [sortColumn.name], [sortColumn.order]);
    const items = paginate(sortedItems, currentPage, pageSize);

    return {
      totalCount: filteredItems.length,
      items
    }
  }

  renderSortIcon(column) {
    if (column.name === this.state.sortColumn.name)
    {
      if (this.state.sortColumn.order === 'asc')
        return <i className="fa fa-sort-asc" />;

      if (this.state.sortColumn.order === 'desc')
        return <i className="fa fa-sort-desc" />;
    }

    return null;
  }

  renderCell(item, column) {
    if (column.content)
      return column.content(item);

    if (column.link)
      return <Link to={column.link(item)}>{item[column.name]}</Link>

    return item[column.name];
  }

  renderDeleteButton(item) {
    return <Button variant="danger" size="sm" onClick={() => this.handleDelete(item)}>Delete</Button>;
  }

  render() {
    const { totalCount, items } = this.getPagedData(this.state.data);
    
    if (this.state.data.length === 0)
      return <p>There are no items in the database.</p>

    return (
      <>
        <SearchBox value={this.state.searchQuery} onChange={this.handleSearch} />
        <p>Showing {totalCount} items on the database.</p>
        <DataPagination
          itemsCount={totalCount}
          pageSize={this.state.pageSize}
          currentPage={this.state.currentPage}
          onPageChange={this.handlePageChange}
        />
        <table className="table">
          <thead>
            <tr>
              {this.props.columns.map(column => (
                <th
                  className="clickable"
                  key={column.name}
                  onClick={() => this.setSorColumn(column.name)}
                >
                  {column.title} {this.renderSortIcon(column)}
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            { items.map(item => (
              <tr key={item.Id}>
                {this.props.columns.map(column => (<td key={item.Id + column.name}>{this.renderCell(item, column)}</td>))}
                <td>{this.renderDeleteButton(item)}</td>
              </tr>)) }
          </tbody>
        </table>
      </>
    );
  }
}
