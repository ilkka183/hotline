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
    rows: [],
    rowCount: 0,
    searchValues: {},
    searchPanel: false,
    pageIndex: 0,
    pageSize: 10,
    sortFields: [],
    showEditModal: false,
    showDeleteModal: false,
    deleteRow: undefined,
    modalDataId: undefined
  }

  getUseModals() {
    return true;
  }

  getForm() {
    throw new Error('You have to implement the method getForm');
  }

  getApiName() {
    throw new Error('You have to implement the method getApiName');
  }

  canEdit(item) {
    return true;
  }

  canDelete(item) {
    return true;
  }

  getItems(pageIndex) {
    throw new Error('You have to implement the method getItems');
  }

  deleteItem() {
    throw new Error('You have to implement the method deleteItem');
  }

  getNewButtonLink() {
    return `/${this.getApiName()}/new`;
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

  async fetchItems(options) {
    let { searchValues, pageIndex, sortFields } = options;

    if (searchValues === undefined)
      searchValues = this.state.searchValues;

    if (pageIndex === undefined)
      pageIndex = this.state.pageIndex;

    if (sortFields === undefined)
      sortFields = this.state.sortFields

    const { data: { rowCount, rows } } = await this.getItems({ searchValues, pageIndex, sortFields });

    this.setState({ rowCount, rows, searchValues, sortFields, pageIndex });
  }

  async componentDidMount() {
    const searchValues = {};

    for (const field of this.fields)
      searchValues[field.name] = '';

    if (this.props.rows) {
      this.setState({ searchValues });
    }
    else {
      const pageIndex = 0;
      const sortFields = []

      await this.fetchItems({ pageIndex, sortFields });
    }
  }

  handlePageChange = async pageIndex => {
    if (this.props.rows) {
      this.setState({ pageIndex });
    }
    else {
      await this.fetchItems({ pageIndex });
    }
  }

  handleSortField = async name => {
    const sortFields = [...this.state.sortFields];

    const index = sortFields.findIndex(field => field.name === name);

    if (index !== -1) {
      const sortField = sortFields[index];

      if (sortField.order === 'asc')
        sortField.order = 'desc';
      else
        sortFields.splice(index, 1);
    }
    else
      sortFields.push({ name, order: 'asc' });

    if (this.props.rows) {
      this.setState({ sortFields });
    }
    else {
      await this.fetchItems({ sortFields });
    }
  }

  handleSearch = query => {
    console.log(this.state.searchValues);

    this.setState({ pageIndex: 0 });
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
    const searchPanel = !this.state.searchPanel;

    this.setState({ searchPanel });
  }

  showNewModal() {
    this.setState({ showEditModal: true, modalDataId: null });
  }

  showEditModal(row) {
    this.setState({ showEditModal: true, modalDataId: row.Id });
  }

  handleShowEditModal = (row) => {
    if (row)
      this.showEditModal(row);
    else
      this.showNewModal();
  }

  handleHideEditModal = () => {
    this.setState({ showEditModal: false, modalDataId: undefined });
  }

  handleSubmitEditModal = async () => {
    const { onEdited } = this.props;

    if (this.props.rows) {
      if (onEdited)
        onEdited();
    }
    else {
      await this.fetchItems({});
    }

    this.handleHideEditModal();
  }

  handleShowDeleteModal = (row) => {
    this.setState({ showDeleteModal: true, deleteRow: row });
  }

  handleHideDeleteModal = () => {
    this.setState({ showDeleteModal: false, deleteRow: undefined });
  }

  handleSubmitDeleteModal = async () => {
    const { onDelete } = this.props;
    const { deleteRow } = this.state;

    if (this.props.rows) {
      if (onDelete)
        onDelete(deleteRow);
    }
    else {
      try {
        await this.deleteItem(deleteRow);

        if (this.props.rows) {
        }
        else {
          await this.fetchItems({});
        }
      }
      catch (ex) {
        toast.error(ex.response.data.sqlMessage);
      }
    }

    this.handleHideDeleteModal();
  }

  filterRows(rows) {
    const { searchValues, sortFields } = this.state;

    for (const name in searchValues) {
      const value = searchValues[name];

      if (value)
        rows = rows.filter(row => row[name].toLowerCase().startsWith(value.toLowerCase()));
    }

    if (sortFields.length > 0) {
      const sortField = sortFields[0];
      
      rows.sort((a, b) => {
        let result = 0;
  
        if (a[sortField.name] > b[sortField.name])
          result = 1;
        else if (a[sortField.name] < b[sortField.name])
          result = -1;
  
        if (sortField.order === 'desc')
          result = -result;
  
        return result;
      });
    }

    return rows;
  }

  paginateRows(rows, pageIndex, pageSize) {
    const offset = pageIndex*pageSize;
    const result = [];
  
    for (let i = 0; i < pageSize; i++) {
      const index = offset + i;
  
      if (index >= rows.length)
        break;
  
        result.push(rows[index]);
    }
  
    return result;
  }  

  renderTitle() {
    const { showTitle, title } = this.props;

    if (!showTitle)
      return null;

    const text = title ? title : this.getTitle();

    return <h2>{text}</h2>;
  }
  
  renderToggleSearchButton() {
    const { searchPanel } = this.state;

    const variant = this.hasSearchValues() ? 'secondary' : 'light';
    const text = searchPanel ? 'Sulje hakupaneeli' : 'Avaa hakupaneeli';

    return <Button className="mb-2 mr-2" variant={variant} size="sm" onClick={this.handleToggleSearchPanel}>{text}</Button>
  }
  
  renderNewButton() {
    const { readOnly, creatable, newButtonAsLink, newButtonText } = this.props;

    if (readOnly || !creatable)
      return null;

    const variant = newButtonAsLink ? 'link' : 'primary';
    const text = newButtonText ? newButtonText : 'Lisää uusi';

    if (this.getUseModals())
      return <Button className="mb-2" variant={variant} onClick={() => this.handleShowEditModal(null)}>{text}</Button>
    else
      return <LinkButton className="mb-2" variant={variant} size="sm" to={this.getNewButtonLink()}>{text}</LinkButton>
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
    if (!this.props.searchPanel)
      return null;

    if (!this.state.searchPanel)
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

  renderPagination(rowCount) {
    const { pageIndex, pageSize } = this.state;

    return (
      <div>
        <DataPagination
          rowCount={rowCount}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageChange={this.handlePageChange}
        />
      </div>
    );
  }

  renderSortIcon(column) {
    const field = this.state.sortFields.find(field => field.name === column.name);

    if (field)
      return <SortIcon order={field.order} />

    return null;
  }

  renderColumn(column) {
    return (
      <th
        className="clickable"
        key={column.name}
        onClick={() => this.handleSortField(column.name)}
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

    if (column.editLink && !readOnly && editable && this.canEdit(row)) {
      if (this.getUseModals())
        return <Button variant="link" size="sm" onClick={() => this.handleShowEditModal(row)}>{text}</Button>
      else
        return <Link to={'/' + this.getApiName() + '/' + row.Id}>{text}</Link>
    }

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

  renderDeleteButton(row) {
    if (this.canDelete(row))
      return <Button variant="danger" size="sm" onClick={() => this.handleShowDeleteModal(row)}>Poista</Button>;

    return null;
  }

  getParentId() {
    return null;
  }

  renderEditModal() {
    const Form = this.getForm();

    if (!Form)
      return null;

    const { showEditModal, modalDataId } = this.state;

    const action = modalDataId ? 'edit' : 'new';

    return (
      <Form
        variant='modal'
        action={action}
        dataId={modalDataId}
        parentId={this.getParentId()}
        showModal={showEditModal}
        onSubmitModal={this.handleSubmitEditModal}
        onHideModal={this.handleHideEditModal}
      />
    );
  }

  renderDeleteModal() {
    const Form = this.getForm();

    if (!Form)
      return null;

    const { showDeleteModal, deleteRow } = this.state;

    const dataId = deleteRow ? deleteRow.Id : null;

    return (
      <Form
        variant='modal'
        action='delete'
        dataId={dataId}
        parentId={this.getParentId()}
        showModal={showDeleteModal}
        submitButtonVariant="danger"
        submitButtonText="Kyllä"
        cancelButtonText="Ei"
        onSubmitModal={this.handleSubmitDeleteModal}
        onHideModal={this.handleHideDeleteModal}
      />
    );
  }

  renderModals() {
  }

  getRows() {
    const { paginate } = this.props;
    const { pageIndex, pageSize } = this.state;

    if (this.props.rows) {
      const filteredRows = this.filterRows(this.props.rows);

      return {
        rowCount: filteredRows.length,
        rows: paginate ? this.paginateRows(filteredRows, pageIndex, pageSize) : filteredRows
      }
    }
    else
      return {
        rowCount: this.state.rowCount,
        rows: this.state.rows
      }
  }

  render() {
    const { readOnly, deletable, paginate } = this.props;
    const { showEditModal, showDeleteModal } = this.state;

    const { rowCount, rows } = this.getRows();
    const columns = this.fields.filter(column => column.visible);

    return (
      <>
        {this.renderHeader()}
        {this.renderSearchPanel()}
        {paginate && this.renderPagination(rowCount)}
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
        {showEditModal && this.renderEditModal()}
        {showDeleteModal && this.renderDeleteModal()}
        {this.renderModals()}
      </>
    );
  }
}

DataTable.defaultProps = {
  showTitle: true,
  searchPanel: true,
  newButtonAsLink: false,
  paginate: true,
  readOnly: false,
  creatable: true,
  editable: true,
  deletable: true
}
