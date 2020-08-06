import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import DataPagination from './DataPagination';
import FieldsComponent, { Field, SortOrder } from './Fields';
import LinkButton from './LinkButton';
import SearchPanel from './SearchPanel';
import SortIcon from './SortIcon';

interface Rows {
  rowCount: number,
  rows: any[]
}

interface SortField {
  name: string,
  order: SortOrder
}

interface SearchOptions {
  searchValues: object,
  pageIndex: number,
  sortFields: SortField[]
}

interface Props {
  rows: any[],
  showTitle: boolean,
  title: string,
  readOnly: boolean,
  editable: boolean,
  deletable: boolean,
  paginate: boolean,
  onEdited: () => void
}

interface State {
  rows: any[],
  rowCount: number,
  searchValues: object,
  searchPanel: boolean,
  pageIndex: number,
  pageSize: number,
  sortFields: SortField[],
  showEditModal: boolean,
  showDeleteModal: boolean,
  deleteRow: any,
  modalDataId: any
}

export default abstract class FieldsTable extends FieldsComponent<Props, State> {
  static defaultProps = {
    showTitle: true,
    searchPanel: true,
    newButtonAsLink: false,
    paginate: true,
    readOnly: false,
    creatable: true,
    editable: true,
    deletable: true
  }
  
  public state = {
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

  public abstract getForm(): any;
  public abstract getApiName(): string;
  public abstract getItems(pageIndex: number): any[];
  public abstract deleteItem(): void;

  public getUseModals(): boolean {
    return true;
  }

  public canEdit(row: any): boolean {
    return true;
  }

  public canDelete(row: any): boolean {
    return true;
  }

  public getNewButtonLink(): string {
    return `/${this.getApiName()}/new`;
  }

  public hasSearchFields(): boolean {
    for (const field of this.fields)
      if (field.search)
        return true;

    return false;
  }

  public hasSearchValues(): boolean {
    const searchValues: any = this.state.searchValues;

    for (const key in searchValues)
      if (searchValues[key])
        return true;

    return false;
  }

  async fetchItems(options: SearchOptions) {
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
    const searchValues: any = {};

    for (const field of this.fields)
      searchValues[field.name] = '';

    if (this.props.rows) {
      this.setState({ searchValues });
    }
    else {
      const pageIndex = 0;
      const sortFields: SortField[] = []

      await this.fetchItems({ pageIndex, sortFields });
    }
  }

  handlePageChange = async (pageIndex: number) => {
    if (this.props.rows) {
      this.setState({ pageIndex });
    }
    else {
      await this.fetchItems({ pageIndex });
    }
  }

  handleSortField = async (name: string) => {
    const sortFields: SortField[] = [...this.state.sortFields];

    const index: number = sortFields.findIndex(field => field.name === name);

    if (index !== -1) {
      const sortField = sortFields[index];

      if (sortField.order === SortOrder.Asc)
        sortField.order = SortOrder.Desc;
      else
        sortFields.splice(index, 1);
    }
    else
      sortFields.push({ name, order: SortOrder.Asc });

    if (this.props.rows) {
      this.setState({ sortFields });
    }
    else {
      await this.fetchItems({ sortFields });
    }
  }

  handleSearch = () => {
    this.setState({ pageIndex: 0 });
  }

  handleSearchFieldChange = ({ currentTarget }) => {
    const searchValues: any = {...this.state.searchValues};
    searchValues[currentTarget.name] = currentTarget.value;

    this.setState({ searchValues });
  }

  handleSearchClear = () => {
    const searchValues: any = {...this.state.searchValues};

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

  showEditModal(row: any) {
    this.setState({ showEditModal: true, modalDataId: row.Id });
  }

  handleShowEditModal = (row: any) => {
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

  handleShowDeleteModal = (row: any) => {
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

  filterRows(rows: any[]) {
    const { searchValues, sortFields } = this.state;

    for (const name in searchValues) {
      const value = searchValues[name];

      if (value)
        rows = rows.filter(row => row[name].toLowerCase().startsWith(value.toLowerCase()));
    }

    if (sortFields.length > 0) {
      const sortField: SortField = sortFields[0];
      
      rows.sort((a, b) => {
        let result = 0;
  
        if (a[sortField.name] > b[sortField.name])
          result = 1;
        else if (a[sortField.name] < b[sortField.name])
          result = -1;
  
        if (sortField.order === SortOrder.Desc)
          result = -result;
  
        return result;
      });
    }

    return rows;
  }

  paginateRows(rows: any[], pageIndex: number, pageSize: number) {
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

  private renderTitle(): JSX.Element | null {
    const { showTitle, title } = this.props;

    if (!showTitle)
      return null;

    const text = title ? title : this.getTitle();

    return <h2>{text}</h2>;
  }
  
  private renderToggleSearchButton(): JSX.Element {
    const { searchPanel } = this.state;

    const variant = this.hasSearchValues() ? 'secondary' : 'light';
    const text = searchPanel ? 'Sulje hakupaneeli' : 'Avaa hakupaneeli';

    return <Button className="mb-2 mr-2" variant={variant} size="sm" onClick={this.handleToggleSearchPanel}>{text}</Button>
  }
  
  private renderNewButton(): JSX.Element | null {
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
  
  private renderHeader(): JSX.Element {
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

  private renderSearchPanel(): JSX.Element | null {
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

  private renderPagination(rowCount: number): JSX.Element {
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

  private renderSortIcon(column: Field): JSX.Element | null {
    const field: SortField | undefined = this.state.sortFields.find(field => field.name === column.name);

    if (field)
      return <SortIcon order={field.order} />

    return null;
  }

  private renderColumn(column: Field): JSX.Element {
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

  private renderCellContent(row: any, column: Field): JSX.Element | string | null {
    if (column.render)
      return column.render(row);

    const text: string | null = column.formatValue(row[column.name]);

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

  private renderCell(row: any, column: Field): JSX.Element {
    return (
      <td
        key={row.Id + column.name}
        align={column.isNumber && false ? 'right' : undefined}
      >
        {this.renderCellContent(row, column)}
      </td>
    );
  }

  private renderDeleteButton(row: any): JSX.Element | null {
    if (this.canDelete(row))
      return <Button variant="danger" size="sm" onClick={() => this.handleShowDeleteModal(row)}>Poista</Button>;

    return null;
  }

  getParentId() {
    return null;
  }

  private renderEditModal(): JSX.Element | null {
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

  private renderDeleteModal(): JSX.Element | null {
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

  private renderModals(): JSX.Element | null {
    return null;
  }

  private getRows(): Rows {
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
