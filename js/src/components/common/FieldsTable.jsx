import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button'
import FieldsComponent from './Fields';
import SortIcon from './SortIcon';
import DataPagination from './DataPagination';
import SearchBox from './SearchBox';
import LinkButton from './LinkButton';
import { paginateItems } from '../../utils/paginate';

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

  renderSortIcon(column) {
    const { name, order } = this.state.sortColumn;

    if (column.name === name)
      return <SortIcon order={order} />

    return null;
  }

  renderCell(item, column) {
    if (column.content)
      return column.content(item);

    const text = column.formatValue(item[column.name]);

    const { editable } = this.props;

    if (column.editLink && editable && this.canEdit(item))
      return <Link to={'/' + this.getApiName() + '/' + item.Id}>{text}</Link>

    if (column.link)
      return <Link to={column.link(item)}>{text}</Link>

    return text;
  }

  renderDeleteButton(item) {
    if (this.canDelete(item))
      return <Button variant="danger" size="sm" onClick={() => this.handleDelete(item)}>Poista</Button>;

    return null;
  }

  getFilteredItems() {
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

  get newButtonLink() {
    return `/${this.getApiName()}/new`;
  }

  get newButtonStyle() {
    return {
      marginBottom: 20
    }
  }

  render() {
    const { editable, deletable, showSearchBox, paginate } = this.props;
    const { data, currentPage, pageSize } = this.state;

    if (data.length === 0)
      return <p>Tietokannassa ei ole yhtään riviä.</p>

    const filteredItems = this.getFilteredItems();
    const items = paginate ? paginateItems(filteredItems, currentPage, pageSize) : filteredItems;
    const columns = this.fields.filter(column => column.visible);

    return (
      <>
        <h2>{this.getTitle()}</h2>
        {editable && <LinkButton style={this.newButtonStyle} to={this.newButtonLink}>Lisää uusi</LinkButton>}
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
                  {column.label} {this.renderSortIcon(column)}
                </th>
              ))}
              {deletable && <th></th>}
            </tr>
          </thead>
          <tbody>
            { items.map(item => (
              <tr key={item.Id}>
                {columns.map(column => (<td key={item.Id + column.name}>{this.renderCell(item, column)}</td>))}
                {deletable &&<td>{this.renderDeleteButton(item)}</td>}
              </tr>)) }
          </tbody>
        </table>
      </>
    );
  }
}

DataTable.defaultProps = {
  showSearchBox: true,
  paginate: true,
  editable: true,
  deletable: true
}
