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
    if (!window.confirm('Poista tietue?'))
      return;

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

  formatBoolean(value) {
    return value ? 'kyllä' : 'ei';
  }

  formatDate(value) {
    if (value) {
      const date = new Date(value);
      return date.toLocaleDateString();
    }
    
    return null;
  }

  formatTime(value) {
    if (value) {
      const date = new Date(value);
      return date.toLocaleTimeString();
    }
    
    return null;
  }

  formatDateTime(value) {
    if (value) {
      const date = new Date(value);
      return date.toLocaleString();
    }
    
    return null;
  }

  renderCell(item, column) {
    if (column.content)
      return column.content(item);

    if (column.editLink && this.props.editable)
      return <Link to={'/' + this.props.schema.pluralName + '/' + item.Id}>{item[column.name]}</Link>

    if (column.link)
      return <Link to={column.link(item)}>{item[column.name]}</Link>

    let value = item[column.name];

    if (column.enums)
      return column.enums[value];

    switch (column.type) {
      case 'boolean': return this.formatBoolean(value);
      case 'date': return this.formatDate(value);
      case 'datetime': return this.formatDateTime(value);
      case 'time': return this.formatTime(value);
      
      default: return value;
    }
  }

  renderDeleteButton(item) {
    return <Button variant="danger" size="sm" onClick={() => this.handleDelete(item)}>Poista</Button>;
  }

  render() {
    const { deletable } = this.props;
    const { totalCount, items } = this.getPagedData(this.state.data);
    
    if (this.state.data.length === 0)
      return <p>There are no items in the database.</p>

    const columns = this.props.schema.fields.filter(column => column.visibleInTable);

    return (
      <>
        <SearchBox value={this.state.searchQuery} onChange={this.handleSearch} />
        <div>
          <DataPagination
            itemsCount={totalCount}
            pageSize={this.state.pageSize}
            currentPage={this.state.currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
        <table className="table">
          <thead>
            <tr>
              {columns.map(column => (
                <th
                  className="clickable"
                  key={column.name}
                  onClick={() => this.setSorColumn(column.name)}
                >
                  {column.title} {this.renderSortIcon(column)}
                </th>
              ))}
              {deletable && <th></th>}
            </tr>
          </thead>
          <tbody>
            { items.map(item => (
              <tr key={item.Id}>
                {columns.map(column => (<td key={item.Id + column.name}>{this.renderCell(item, column)}</td>))}
                {deletable && <td>{this.renderDeleteButton(item)}</td>}
              </tr>)) }
          </tbody>
        </table>
      </>
    );
  }
}
