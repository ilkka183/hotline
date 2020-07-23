import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import DataPagination from './DataPagination';
import FieldsComponent from './Fields';
import LinkButton from './LinkButton';
import SearchPanel from './SearchPanel';
import SortIcon from './SortIcon';

export default class DataTable extends FieldsComponent {
  state = {
    data: [],
    searchValues: {},
    searchPanelVisible: false,
    currentPage: 1,
    pageSize: 10,
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
    if (this.props.data)
      return;

    const { data } = await this.getItems();

    const searchValues = {};

    for (const field of this.fields)
      searchValues[field.name] = '';

    this.setState({ data, searchValues });
  }

  hasSearchFields() {
    for (const field of this.fields)
      if (field.search)
        return true;

    return false;
  }

  hasSearchValues() {
    const { searchValues } = this.state;

    for (const name in searchValues)
      if (searchValues[name])
        return true;

    return false;
  }

  handleDelete = async item => {
    if (!window.confirm('Poista rivi?'))
      return;

    if (this.props.onDelete)
      this.props.onDelete(item);
    else {
      try {
        await this.deleteItem(item);
  
        const data = this.state.data.filter(m => m.Id !== item.Id);
    
        this.setState({ data });
      }
      catch (ex) {
        toast.error(ex.response.data.sqlMessage);
      }
    }
  }

  handleSearch = query => {
    console.log(this.state.searchValues);

    this.setState({ currentPage: 1 });
  }

  handleSearchFieldChange = ({ currentTarget }) => {
    const searchValues = {...this.state.searchValues};
    searchValues[currentTarget.name] = currentTarget.value;

    this.setState({ searchValues });
  }

  handleSearchClear = () => {
    const searchValues = {...this.state.searchValues};

    for (const name in searchValues)
      searchValues[name] = '';

    this.setState({ searchValues });
  }

  handleToggleSearchPanel = () => {
    const searchPanelVisible = !this.state.searchPanelVisible;

    this.setState({ searchPanelVisible });
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

  getData() {
    if (this.props.data)
      return this.props.data;
    else
      return this.state.data;
  }

  getFilteredRows() {
    const { searchValues, sortColumn } = this.state;

    let rows = this.getData();

    for (const name in searchValues) {
      const value = searchValues[name];

      if (value)
        rows = rows.filter(row => row[name].toLowerCase().startsWith(value.toLowerCase()));
    }

    if (sortColumn.name) {
      rows.sort((a, b) => {
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

    return rows;
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

  renderTitle() {
    const { showTitle, title } = this.props;

    if (!showTitle)
      return null;

    const text = title ? title : this.getTitle();

    return <h2>{text}</h2>;
  }
  
  renderToggleSearchButton() {
    const { searchPanelVisible } = this.state;

    const variant = this.hasSearchValues() ? 'secondary' : 'light';
    const text = searchPanelVisible ? 'Sulje hakupaneeli' : 'Avaa hakupaneeli';

    return <Button className="mb-2 mr-2" variant={variant} size="sm" onClick={this.handleToggleSearchPanel}>{text}</Button>
  }
  
  renderNewButton() {
    const { readOnly, creatable, newButtonAsLink, newButtonText } = this.props;

    if (readOnly || !creatable)
      return null;

    const variant = newButtonAsLink ? 'link' : 'primary';
    const to = this.getNewButtonLink();
    const text = newButtonText ? newButtonText : 'Lisää uusi';

    return <LinkButton className="mb-2" variant={variant} size="sm" to={to}>{text}</LinkButton>
  }
  
  renderHeader() {
    return (
      <Row>
        <Col>{this.renderTitle()}</Col>
        <Col className="text-right">
          {this.hasSearchFields() && this.renderToggleSearchButton()}
          {this.renderNewButton()}
        </Col>
      </Row>
    );
  }

  renderSearchPanel() {
    if (!this.props.showSearchPanel)
      return null;

    if (!this.state.searchPanelVisible)
      return null;
      
    return (
      <SearchPanel
        table={this}
        onChange={this.handleSearchFieldChange}
        onClear={this.handleSearchClear}
        onSearch={this.handleSearch}
      />
    );
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

  renderCellContent(row, column) {
    if (column.render)
      return column.render(row);

    const text = column.formatValue(row[column.name]);

    const { readOnly, editable } = this.props;

    if (column.editLink && !readOnly && editable && this.canEdit(row))
      return <Link to={'/' + this.getApiName() + '/' + row.Id}>{text}</Link>

    if (column.link)
      return <Link to={column.link(row)}>{text}</Link>

    return text;
  }

  renderCell(row, column) {
    return (
      <td
        key={row.Id + column.name}
        align={column.isNumber && false ? 'right' : undefined}
      >
        {this.renderCellContent(row, column)}
      </td>
    );
  }

  renderDeleteButton(item) {
    if (this.canDelete(item))
      return <Button variant="danger" size="sm" onClick={() => this.handleDelete(item)}>Poista</Button>;

    return null;
  }

  render() {
    const { readOnly, deletable, paginate } = this.props;
    const { currentPage, pageSize } = this.state;

    const filteredRows = this.getFilteredRows();
    const rows = paginate ? this.paginateRows(filteredRows, currentPage, pageSize) : filteredRows;
    const columns = this.fields.filter(column => column.visible);

    return (
      <>
        {this.renderHeader()}
        {this.renderSearchPanel()}
        {paginate && this.renderPagination(filteredRows)}
        <table className="table">
          <thead>
            <tr>
              {columns.map(column => this.renderColumn(column))}
              {!readOnly && deletable && <th></th>}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.Id}>
                {columns.map(column => this.renderCell(row, column))}
                {!readOnly && deletable &&<td>{this.renderDeleteButton(row)}</td>}
              </tr>))}
          </tbody>
        </table>
      </>
    );
  }
}

DataTable.defaultProps = {
  showTitle: true,
  showSearchPanel: true,
  newButtonAsLink: false,
  paginate: true,
  readOnly: false,
  creatable: true,
  editable: true,
  deletable: true
}
