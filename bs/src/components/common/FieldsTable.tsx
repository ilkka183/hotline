import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import DataPagination from './DataPagination';
import FieldsComponent, { Field, SortOrder } from './Fields';
import LinkButton from './LinkButton';
import SearchPanel from './SearchPanel';
import SortIcon from './SortIcon';
import { EditMode } from './FieldsForm';

export enum Pagination { None, Top, Bottom, Both }

interface SortField {
  name: string,
  order: SortOrder
}

export interface Rows {
  rowCount: number,
  rows: any[]
}

export interface SearchOptions {
  pageIndex?: number,
  pageSize?: number,
  searchValues?: object,
  sortFields?: SortField[]
}

export interface FieldsTableProps {
  newButtonText?: string,
  pagination?: Pagination,
  routedPages?: boolean,
  history?: any,
  location?: any,
  pageIndex?: number,
  pageSize?: number,
  creatable?: boolean,
  editable?: boolean,
  deletable?: boolean,
  autoHide?: boolean,
  rows?: any[],
  showTitle?: boolean,
  title?: string,
  readOnly?: boolean,
  searchPanel?: boolean,
  onPage?: (index: number) => void,
  onEdited?: () => void,
  onDelete?: (row: any) => void
}

export interface FieldsTableState {
  rows: any[],
  rowCount: number,
  pageIndex: number,
  pageSize: number,
  searchValues: object,
  searchPanel: boolean,
  sortFields: SortField[],
  showNewModal: boolean,
  editMode: EditMode | undefined,
  editRow: any,
  modalDataId: any
}

export default abstract class FieldsTable<P> extends FieldsComponent<P & FieldsTableProps, FieldsTableState> {
  static defaultProps = {
    showTitle: true,
    searchPanel: true,
    pagination: Pagination.Bottom,
    routedPages: false,
    pageIndex: 0,
    pageSize: 10,
    readOnly: false,
    creatable: true,
    editable: true,
    deletable: true
  }
  
  public state: FieldsTableState = {
    rows: [],
    rowCount: 0,
    pageIndex: 0,
    pageSize: this.getDefaultPageSize(),
    searchValues: {},
    searchPanel: false,
    sortFields: [],
    showNewModal: false,
    editMode: undefined,
    editRow: undefined,
    modalDataId: undefined
  }

  public get pageIndex(): number {
    return this.props.routedPages ? this.props.pageIndex! : this.state.pageIndex;
  }

  public get pageSize(): number {
    return this.props.routedPages ? this.props.pageSize! : this.state.pageSize;
  }

  protected getDefaultPageSize(): number {
    return 10;
  }

  protected abstract getModalForm(): any;
  protected abstract getApiName(): string;

  public getUseModals(): boolean {
    return true;
  }

  protected canUpdateRow(row: any): boolean {
    return true;
  }

  protected canDeleteRow(row: any): boolean {
    return true;
  }

  protected isRowDisabled(row: any): boolean {
    return false;
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

  protected abstract async getItems(options: SearchOptions): Promise<Rows>;

  protected async fetchItems(options: SearchOptions) {
    let { pageIndex, pageSize, searchValues, sortFields } = options;

    if (pageIndex === undefined)
      pageIndex = this.pageIndex;

    if (pageSize === undefined)
      pageSize = this.pageSize;

    if (searchValues === undefined)
      searchValues = this.state.searchValues;

    if (sortFields === undefined)
      sortFields = this.state.sortFields

    const { rowCount, rows } = await this.getItems({ pageIndex, pageSize, searchValues, sortFields });

    this.setState({ rowCount, rows, searchValues, sortFields });
  }

  public async componentDidMount() {
    const searchValues: any = {};

    for (const field of this.fields)
      searchValues[field.name] = '';

    if (this.props.rows) {
      this.setState({ searchValues });
    }
    else {
      const sortFields: SortField[] = []
      await this.fetchItems({ sortFields, searchValues });
    }
  }

  public async componentDidUpdate(prevProps: any) {
    if (this.props.routedPages && (this.props.pageIndex !== prevProps.pageIndex)) {
      const sortFields: SortField[] = []
      await this.fetchItems({ sortFields });
    }
  }

  private readonly handlePageChange = async (pageIndex: number) => {
    const { routedPages, history, location } = this.props;

    if (routedPages) {
      if (history && location)
        history.replace(location.pathname + '?page=' + (pageIndex + 1));
    } else {
      this.setState({ pageIndex });

      if (!this.props.rows)
        await this.fetchItems({ pageIndex });
    }
  }

  private readonly handlePageSize = async (size: number) => {
    this.setState({ pageIndex: 0, pageSize: size });

    if (!this.props.rows)
      await this.fetchItems({ pageIndex: 0, pageSize: size });
  }

  private readonly handleSortField = async (name: string) => {
    const sortFields: SortField[] = [...this.state.sortFields];

    const index: number = sortFields.findIndex(field => field.name === name);

    if (index !== -1) {
      const sortField: SortField = sortFields[index];

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

  private readonly handleSearch = async () => {
    const { searchValues } = this.state;

    await this.fetchItems({ pageIndex: 0, searchValues });
  }

  private readonly handleSearchFieldChange = ({ currentTarget }: any ) => {
    const searchValues: any = {...this.state.searchValues};
    searchValues[currentTarget.name] = currentTarget.value;

    console.log(searchValues);

    this.setState({ searchValues });
  }

  private readonly handleSearchClear = async () => {
    const searchValues: any = {...this.state.searchValues};

    for (const name in searchValues)
      searchValues[name] = '';

    await this.fetchItems({ pageIndex: 0, searchValues });
  }

  private readonly handleToggleSearchPanel = () => {
    const searchPanel = !this.state.searchPanel;

    this.setState({ searchPanel });
  }

  protected showNewModal() {
    this.setState({ editMode: EditMode.Insert, modalDataId: null });
  }

  private readonly handleShowNewModal = () => {
    this.showNewModal();
  }

  private readonly handleShowEditModal = (editMode: EditMode, row: any) => {
    this.setState({ editMode, modalDataId: row.Id, editRow: row });
  }

  private readonly handleHideEditModal = () => {
    this.setState({ editMode: undefined, modalDataId: undefined, editRow: undefined });
  }

  private readonly handleSubmitEditModal = async () => {
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

  private filterRows(rows: any[]) {
    const { sortFields } = this.state;
    const searchValues: any = this.state.searchValues;

    for (const name in searchValues) {
      const value: any = searchValues[name];

      if (value)
        rows = rows.filter(row => row[name].toLowerCase().startsWith(value.toLowerCase()));
    }

    if (sortFields.length > 0) {
      const sortField: SortField = sortFields[0];
      
      rows.sort((a, b) => {
        let result: number = 0;
  
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

  protected abstract getTitle(): string;

  private renderTitle(): JSX.Element | null {
    const { showTitle, title } = this.props;

    if (!showTitle)
      return null;

    const text: string = title ? title! : this.getTitle();

    return <h2>{text}</h2>;
  }
  
  private renderToggleSearchButton(): JSX.Element {
    const { searchPanel } = this.state;

    const variant: string = this.hasSearchValues() ? 'secondary' : 'light';
    const text: string = searchPanel ? 'Sulje hakupaneeli' : 'Avaa hakupaneeli';

    return <Button className="mb-2 mr-2" variant={variant} onClick={this.handleToggleSearchPanel}>{text}</Button>
  }
  
  protected showNewButton(): boolean {
    return this.getModalForm();
  }

  protected showUpdateButton(): boolean {
    return this.getModalForm();
  }

  protected showDeleteButton(): boolean {
    return this.getModalForm();
  }

  private renderNewButton(): JSX.Element | null {
    const { readOnly, creatable, newButtonText } = this.props;

    if (readOnly || !creatable)
      return null;

    if (!this.showNewButton())
      return null;

    const text: string = newButtonText ? newButtonText! : 'Lisää uusi';

    if (this.getUseModals())
      return <Button className="mb-2" variant="success" onClick={() => this.handleShowNewModal()}>{text}</Button>
    else
      return <LinkButton className="mb-2" variant="primary" size="sm" to={this.getNewButtonLink()}>{text}</LinkButton>
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
    const { newButtonText, searchPanel } = this.props;

    if (!searchPanel)
      return null;

    if (!this.state.searchPanel)
      return null;
      
    return (
      <SearchPanel
        table={this}
        newButtonText={newButtonText}
        onChange={this.handleSearchFieldChange}
        onClear={this.handleSearchClear}
        onNew={this.handleShowNewModal}
        onSearch={this.handleSearch}
      />
    );
  }

  private renderPagination(rowCount: number): JSX.Element {
    return (
      <div>
        <DataPagination
          rowCount={rowCount}
          pageIndex={this.pageIndex}
          pageSize={this.pageSize}
          onPageChange={this.handlePageChange}
          onPageSize={this.handlePageSize}
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

    if (column.show && !column.show(row))
      return null;

    const text: string | null = column.formatValue(row[column.name], true);

    const { readOnly, editable } = this.props;

    if (column.editLink && !readOnly && editable && this.canUpdateRow(row)) {
      if (this.getUseModals())
        return <Button variant="link" size="sm" onClick={() => this.handleShowEditModal(EditMode.Update, row)}>{text}</Button>
      else
        return <Link to={'/' + this.getApiName() + '/' + row.Id}>{text}</Link>
    }

    if (column.link)
      return <Link to={column.link(row)}>{text}</Link>

    if (column.isCode)
      return <code>{text}</code>

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

  private renderRowUpdateButton(row: any): JSX.Element | null {
    if (this.canUpdateRow(row))
      return <Button variant="primary" size="sm" onClick={() => this.handleShowEditModal(EditMode.Update, row)}>Muokkaa</Button>;

    return null;
  }

  private renderRowDeleteButton(row: any): JSX.Element | null {
    if (this.canDeleteRow(row))
      return <Button variant="danger" size="sm" onClick={() => this.handleShowEditModal(EditMode.Delete, row)}>Poista</Button>;

    return null;
  }

  protected getParent(): any {
    return undefined;
  }

  private renderEditModal(): JSX.Element | null {
    const Form: any = this.getModalForm();

    if (!Form)
      return null;

    const { editMode, modalDataId } = this.state;

    return (
      <Form
        variant='modal'
        editMode={editMode}
        dataId={modalDataId}
        parent={this.getParent()}
        showModal={editMode !== undefined}
        onModalSubmitted={this.handleSubmitEditModal}
        onHideModal={this.handleHideEditModal}
      />
    );
  }

  protected renderModals(): JSX.Element | null {
    return null;
  }

  private paginateRows(rows: any[], pageIndex: number, pageSize: number): any[] {
    const offset: number = pageIndex*pageSize;
    const result: any[] = [];
  
    for (let i: number = 0; i < pageSize; i++) {
      const index = offset + i;
  
      if (index >= rows.length)
        break;
  
        result.push(rows[index]);
    }
  
    return result;
  }  

  private getRows(): Rows {
    const { pagination } = this.props;

    if (this.props.rows) {
      const filteredRows = this.filterRows(this.props.rows!);

      return {
        rowCount: filteredRows.length,
        rows: (pagination !== Pagination.None) ? this.paginateRows(filteredRows, this.pageIndex, this.pageSize) : filteredRows
      }
    }
    else
      return {
        rowCount: this.state.rowCount,
        rows: this.state.rows
      }
  }

  private get showRowUpdateButton(): boolean {
    const { readOnly, editable } = this.props;

    return !readOnly! && editable! && this.showUpdateButton();
  }

  private get showRowDeleteButton(): boolean {
    const { readOnly, deletable } = this.props;

    return !readOnly! && deletable! && this.showDeleteButton();
  }

  private rowClassName(row: any): string | undefined {
    return this.isRowDisabled(row) ? 'disabled' : undefined;
  }

  public render(): JSX.Element {
    const { pagination } = this.props;
    const { editMode } = this.state;

    const { rowCount, rows } = this.getRows();
    const columns = this.fields.filter(column => column.visible);

    return (
      <>
        {this.renderHeader()}
        {this.renderSearchPanel()}
        {(pagination === Pagination.Top || pagination === Pagination.Both) && this.renderPagination(rowCount)}
        <table className="table">
          <thead>
            <tr>
              {columns.map(column => this.renderColumn(column))}
              {this.showRowUpdateButton && <th></th>}
              {this.showRowDeleteButton && <th></th>}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr className={this.rowClassName(row)} key={row.Id}>
                {columns.map(column => this.renderCell(row, column))}
                {this.showRowUpdateButton &&<td>{this.renderRowUpdateButton(row)}</td>}
                {this.showRowDeleteButton &&<td>{this.renderRowDeleteButton(row)}</td>}
              </tr>))}
          </tbody>
        </table>
        {(pagination === Pagination.Bottom || pagination === Pagination.Both) && this.renderPagination(rowCount)}
        {(editMode !== undefined) && this.renderEditModal()}
        {this.renderModals()}
      </>
    );
  }
}
