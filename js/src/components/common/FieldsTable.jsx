import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button'
import DataPagination from './DataPagination';
import FieldsComponent from './Fields';
import LinkButton from './LinkButton';
import SearchBox from './SearchBox';
import SortIcon from './SortIcon';

export default class DataTable extends FieldsComponent {
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

  getApiName() {
    throw new Error('You have to implement the method getApiName!');
  }

  canEdit(item) {
    return true;
  }

  canDelete(item) {
    return true;
  }

  getItems() {
    throw new Error('You have to implement the method getItems!');
  }

  deleteItem() {
    throw new Error('You have to implement the method deleteItem!');
  }

  getNewButtonLink() {
    return `/${this.getApiName()}/new`;
  }

  async componentDidMount() {
    const { data } = await this.getItems();

    this.setState({ data });
  }

  handleDelete = async item => {
    if (!window.confirm('Poista rivi?'))
      return;

    try {
      await this.deleteItem(item);

      const data = this.state.data.filter(m => m.Id !== item.Id);
  
      this.setState({ data });
    }
    catch (ex) {
      toast.error(ex.response.data.sqlMessage);
    }
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

  getFilteredRows() {
    const { data, searchQuery, sortColumn } = this.state;

    let items = data;

    if (searchQuery)
      items = data.filter(m => m.Title.toLowerCase().startsWith(searchQuery.toLowerCase()));

    if (sortColumn.name) {
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

    return items;
  }

  paginateRows(items, pageNumber, pageSize) {
    const startIndex = (pageNumber - 1)*pageSize;
    const slice = [];
  
    for (let i = 0; i < pageSize; i++) {
      const index = startIndex + i;
  
      if (index >= items.length)
        break;
  
      const item =  items[index];
      slice.push(item);
    }
  
    return slice;
  }  

  renderNewButton() {
    const style = {
      marginBottom: 20
    }
  
    return <LinkButton style={style} to={this.getNewButtonLink()}>Lisää uusi</LinkButton>
  }

  renderSearchBox() {
    return <SearchBox value={this.state.searchQuery} onChange={this.handleSearch} />
  }

  renderPagination(filteredItems) {
    return (
      <div>
        <DataPagination
          itemsCount={filteredItems.length}
          pageSize={this.state.pageSize}
          currentPage={this.state.currentPage}
          onPageChange={this.handlePageChange}
        />
      </div>
    );
  }

  renderSortIcon(column) {
    const { name, order } = this.state.sortColumn;

    if (column.name === name)
      return <SortIcon order={order} />

    return null;
  }

  renderColumn(column) {
    return (
      <th
        className="clickable"
        key={column.name}
        onClick={() => this.setSorColumn(column.name)}
      >
        {column.label} {this.renderSortIcon(column)}
      </th>
    );
  }

  renderCell(row, column) {
    if (column.content)
      return column.content(row);

    const text = column.formatValue(row[column.name]);

    const { editable } = this.props;

    if (column.editLink && editable && this.canEdit(row))
      return <Link to={'/' + this.getApiName() + '/' + row.Id}>{text}</Link>

    if (column.link)
      return <Link to={column.link(row)}>{text}</Link>

    return text;
  }

  renderDeleteButton(item) {
    if (this.canDelete(item))
      return <Button variant="danger" size="sm" onClick={() => this.handleDelete(item)}>Poista</Button>;

    return null;
  }

  render() {
    const { creatable, deletable, showSearchBox, paginate } = this.props;
    const { currentPage, pageSize } = this.state;

    const filteredRows = this.getFilteredRows();
    const rows = paginate ? this.paginateRows(filteredRows, currentPage, pageSize) : filteredRows;
    const columns = this.fields.filter(column => column.visible);

    return (
      <>
        <h2>{this.getTitle()}</h2>
        {creatable && this.renderNewButton()}
        {showSearchBox && this.renderSearchBox()}
        {paginate && this.renderPagination(filteredRows)}
        <table className="table">
          <thead>
            <tr>
              {columns.map(column => this.renderColumn(column))}
              {deletable && <th></th>}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.Id}>
                {columns.map(column => (<td key={row.Id + column.name}>{this.renderCell(row, column)}</td>))}
                {deletable &&<td>{this.renderDeleteButton(row)}</td>}
              </tr>))}
          </tbody>
        </table>
      </>
    );
  }
}

DataTable.defaultProps = {
  showSearchBox: true,
  paginate: true,
  creatable: true,
  editable: true,
  deletable: true
}
