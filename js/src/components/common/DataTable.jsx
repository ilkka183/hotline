import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import DataPagination from './DataPagination';
import SearchBox from './SearchBox';
import { paginateItems } from '../../utils/paginate';

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

  formatValue(item, column) {
    let value = item[column.name];

    if (column.enums)
      return column.enums[value];

    switch (column.type) {
      case 'boolean': return this.formatBoolean(value);
      case 'date': return this.formatDate(value, column);
      case 'datetime': return column.displayFormat === 'date' ? this.formatDate(value, column) : this.formatDateTime(value);
      case 'time': return this.formatTime(value);
      
      default: return value;
    }
  }

  renderCell(item, column) {
    if (column.content)
      return column.content(item);

    const text = this.formatValue(item, column);

    if (column.editLink && this.props.editable)
      return <Link to={'/' + this.props.schema.pluralName + '/' + item.Id}>{text}</Link>

    if (column.link)
      return <Link to={column.link(item)}>{text}</Link>

    return text;
  }

  renderDeleteButton(item) {
    return <Button variant="danger" size="sm" onClick={() => this.handleDelete(item)}>Poista</Button>;
  }

  sortItems(items, sortColumn) {
    items.sort((a, b) => {
      let result = 0;

      if (a[sortColumn.name] > b[sortColumn.name])
        result = 1;
      else if (a[sortColumn.name] < b[sortColumn.name])
        result = -1;

      if (sortColumn.order === 'desc')
        result = -result;

      return result;
    });
  }

  render() {
    const { data, searchQuery, sortColumn, currentPage, pageSize } = this.state;

    let filteredItems = data;

    if (searchQuery)
      filteredItems = data.filter(m => m.Title.toLowerCase().startsWith(searchQuery.toLowerCase()));

    this.sortItems(filteredItems, sortColumn);

    const showSearchBox = this.props.showSearchBox === undefined || this.props.showSearchBox;
    const paginate = this.props.paginate === undefined || this.props.paginate;
    
    const items = paginate ? paginateItems(filteredItems, currentPage, pageSize) : filteredItems;

    if (this.state.data.length === 0)
      return <p>There are no items in the database.</p>

    const { deletable } = this.props;
    const columns = this.props.schema.fields.filter(column => column.visibleInTable);

    return (
      <>
        {showSearchBox && <SearchBox value={this.state.searchQuery} onChange={this.handleSearch} />}
        {paginate && <div>
          <DataPagination
            itemsCount={filteredItems.length}
            pageSize={this.state.pageSize}
            currentPage={this.state.currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>}
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
