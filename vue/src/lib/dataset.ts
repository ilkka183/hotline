import { AxiosInstance } from 'axios';

export enum TextAlign {
  Left,
  Center,
  Right
}


class Lookup {
  private field: Field;
  private api: string = null;
  private options: any[] = null;

  constructor(field: Field) {
    this.field = field;
  }

  public setApi(value: string) {
    this.api = value;
  }

  public setOptions(value: any[]) {
    this.options = value;
  }

  public findText(value: any): string {
    if (this.options && (value !== null) && (value !== undefined))
      for (const option of this.options)
        if (option.value == value)
          return option.text;

    return null;
  }

  async fetchApiOptions() {
    if (!this.options && this.field.dataset && this.api)
      this.options = await this.field.dataset.fetchLookupOptions(this.api);
  }  
}


interface FieldParams {
  name: string;
  caption: string;
  align?: TextAlign;
  default?: any;
  hideInDialog?: boolean;
  hideInGrid?: boolean;
  primaryKey?: boolean;
  foreignKey?: boolean;
  readonly?: boolean;
  required?: boolean;
  lookupApi?: string;
  onCellColor?: any;
}

export abstract class Field {
  public dataset: Dataset | undefined;
  public readonly name: string;
  public caption: string;
  public align: TextAlign = TextAlign.Left;
  public default: any = undefined;
  public hideInDialog = false;
  public hideInGrid = false;
  public primaryKey = false;
  public foreignKey = false;
  public readonly = false;
  public required = false;
  public lookup: Lookup = null;
  public onCellColor: any = null;

  constructor(params: FieldParams) {
    this.name = params.name;
    this.caption = params.caption;

    if (params.align)
      this.align = params.align;

    if (params.default)
      this.default = params.default;

    if (params.hideInDialog)
      this.hideInDialog = params.hideInDialog;

    if (params.hideInGrid)
      this.hideInGrid = params.hideInGrid;

    if (params.lookupApi)
      this.createLookup().setApi(params.lookupApi);

    if (params.primaryKey)
      this.primaryKey = params.primaryKey;

    if (params.foreignKey)
      this.foreignKey = params.foreignKey;

    if (params.readonly)
      this.readonly = params.readonly;

    if (params.required)
      this.required = params.required;

    if (params.onCellColor)
      this.onCellColor = params.onCellColor;
  }

  protected createLookup() {
    if (!this.lookup)
      this.lookup = new Lookup(this);

    return this.lookup;
  }

  get database(): RestDatabase | null {
    return this.dataset?.database;
  }  

  public getAutoFocus(): boolean {
    return this == this.dataset?.autoFocusField;
  }

  public abstract getType(): any;

  public getInputTextLength(): number {
    return 10;
  }

  get alignRight(): boolean {
    return (this.align === TextAlign.Right);
  }

  get alignCenter(): boolean {
    return (this.align === TextAlign.Center);
  }

  get isCode(): boolean {
    return false;
  }

  get isPrimaryKey(): boolean {
    return this.primaryKey;
  }

  get isReadOnly(): boolean {
    return this.readonly;
  }

  get isRequired(): boolean {
    return this.required || this.primaryKey;
  }

  public isNull(row: object): boolean {
    return row[this.name] === null;
  }

  public  isNullOrEmpty(row: object): boolean {
    return (row[this.name] === null) || (row[this.name] === '');
  }

  public isValid(row: object): boolean {
    return this.isRequired ? !this.isNullOrEmpty(row) : true;
  }

  value(row: object): any {
    return row[this.name];
  }

  public displayText(row: object): string {
    if (this.lookup)
      return this.lookup.findText(row[this.name]);

    return this.getDisplayText(row[this.name]);
  }

  protected getDisplayText(value: any): string {
    return value;
  }

  cellColor(row: object) {
    if (this.onCellColor)
      return this.onCellColor(row);

    return null;
  }

  showDialogCaption(): boolean {
    return true;
  }

  dialogInputType(): string {
    if (this.lookup)
      return 'select';
    else
      return 'text';
  }
}


class BinaryField extends Field {
  constructor(params: FieldParams) {
    super(params);
  }

  public getType(): any {
    return ArrayBuffer;
  }
}


class ImageField extends BinaryField {
  constructor(params: FieldParams) {
    super(params);
  }
}


class BooleanField extends Field {
  constructor(params: FieldParams) {
    super(params);
  }

  public getType(): any {
    return Boolean;
  }

  protected getDisplayText(value: any): string {
    if (value)
      return 'kyllä';
    else
      return 'ei';
  }

  showDialogCaption(): boolean {
    return false;
  }

  dialogInputType(): string {
    return 'checkbox';
  }
}


class DateField extends Field {
  constructor(params: FieldParams) {
    super(params);
  }

  public getType(): any {
    return Date;
  }

  protected getDisplayText(value): string {
    if (value) {
      const date = new Date(value);
      return this.toDisplayString(date);
    }

    return null;
  }

  toDisplayString(date: Date): string {
    return date.toLocaleDateString();
  }

  getInputTextLength(): number {
    return 20;
  }
}


class DateTimeField extends DateField {
  constructor(params: FieldParams) {
    super(params);
  }

  toDisplayString(date: Date): string {
    return date.toLocaleString();
  }

  getInputTextLength(): number {
    return 20;
  }
}


interface IntegerFieldParams extends FieldParams {
  enumTexts?: string[];
}

class IntegerField extends Field {
  constructor(params: IntegerFieldParams) {
    super(params);

    if (params.enumTexts) {
      const options = [];

      for (const value in params.enumTexts)
        options.push({ value, text: params.enumTexts[value] });

      this.createLookup().setOptions(options);
    }
  }

  public getType(): any {
    return Number;
  }
}


class AutoIncrementField extends IntegerField {
  constructor(params: FieldParams) {
    super(params);
    
    this.primaryKey = true;
  }

  get isReadOnly(): boolean {
    return true;
  }
}


interface StringFieldParams extends FieldParams {
  code?: boolean;
  length?: number;
}

class StringField extends Field {
  public code = false;
  public length: number | undefined;

  constructor(params: StringFieldParams) {
    super(params);

    if (params.code)
      this.code = params.code;

    if (params.length)
      this.length = params.length;
  }

  public getType(): any {
    return String;
  }

  getInputTextLength(): number {
    if (this.length != null)
      return this.length;
    else
      return super.getInputTextLength();
  }

  get isCode(): boolean {
    return this.code;
  }

  dialogInputType(): string {
    return 'text';
  }
}


interface TextFieldParams extends StringFieldParams {
  cols?: number;
  rows?: number;
}

class TextField extends StringField {
  public cols: number | undefined;
  public rows: number | undefined = 5;

  constructor(params: TextFieldParams) {
    super(params);

    if (params.cols)
      this.cols = params.cols;

    if (params.rows)
      this.rows = params.rows;
  }

  getCols(): number {
    return this.cols;
  }
  
  getRows(): number {
    return this.rows;
  }
  
  dialogInputType(): string {
    return 'textarea';
  }
}


export abstract class Dataset {
  public readonly database: RestDatabase;  
  public fields: object = {};
  public fixedValues: object = {};
  public autoFocusField: Field | null = null;

  constructor(database: RestDatabase) {
    this.database = database;
  }

  get axios(): AxiosInstance {
    return this.database.axios;
  }  

  public get rowsPerPage(): number {
    return this.getRowsPerPage();
  }

  protected getRowsPerPage(): number {
    return 10;
  }

  public get fieldsAsArray(): Field[] {
    return Object.values(this.fields);
  }

  private addField(field: Field) {
    field.dataset = this;

    if ((this.autoFocusField == null) && !field.isReadOnly)
      this.autoFocusField = field;

    this.fields[field.name] = field;
  }

  protected addAutoIncrementField(params: FieldParams) {
    this.addField(new AutoIncrementField(params));
  }

  protected addBooleanField(params: FieldParams) {
    this.addField(new BooleanField(params));
  }

  protected addDateField(params: FieldParams) {
    this.addField(new DateField(params));
  }

  protected addDateTimeField(params: FieldParams) {
    this.addField(new DateTimeField(params));
  }

  protected addImageField(params: FieldParams) {
    this.addField(new ImageField(params));
  }

  protected addIntegerField(params: IntegerFieldParams) {
    this.addField(new IntegerField(params));
  }

  protected addStringField(params: StringFieldParams) {
    this.addField(new StringField(params));
  }

  protected addTextField(params: TextFieldParams) {
    this.addField(new TextField(params));
  }

  public newRow(): object {
    const row: object = {};

    for (const field of this.fieldsAsArray) {
      let value = null;

      if (!field.isReadOnly && (field.default !== undefined))
        value = field.default;

      row[field.name] = value;
    }

    console.log('Fixed', this.fixedValues);

    for (const name in this.fixedValues) {
      console.log('Fixed', name, this.fixedValues[name]);
      row[name] = this.fixedValues[name];
    }

    this.initialize(row);

    return row;
  }

  protected initialize(row: object) {
    //
  }

  public static copyRow(row: object) {
    const result: object = {};

    for (const key of Object.keys(row))
      result[key] = row[key];

    return result;
  }

  public get primaryKeyField(): Field | null {
    for (const field of this.fieldsAsArray)
      if (field.isPrimaryKey)
        return field;

    return null;
  }

  public primaryKeys(row: object) {
    const keys: any = {};

    for (const field of this.fieldsAsArray)
      if (field.isPrimaryKey)
        keys[field.name] = row[field.name];

    return keys;
  }

  public contentCaptionOf(row: object): string {
    let text = '';

    for (const field of this.fieldsAsArray)
      if ((field.isPrimaryKey) || (field.getType() == String)) {
        const value = row[field.name];

        if (value) {
          if (text)
            text += ', ';

          text += value;
        }
      }

    return text;
  }

  public primaryKeysEquals(row1: any, row2: any) {
    for (const field of this.fieldsAsArray)
      if ((field.isPrimaryKey) && (row1[field.name] != row2[field.name]))
        return false;

    return true;
  }

  public async fetchLookups() {
    for (const field of this.fieldsAsArray)
      if (field.lookup)
        await field.lookup.fetchApiOptions();
  }

  public async abstract fetchLookupOptions(api: string): Promise<any>;
}


export enum EditState {
  Add,
  Edit,
  Open
}


export class EditedData {
  public table: any;
  public row: object;
  
  constructor(table: any, row: object) {
    this.table = table;
    this.row = row;
  }
}


export class RestDatabase {
  public readonly axios: AxiosInstance;
  public pageNumber: number | null = null;
  public savedData: EditedData | null = null;
  public addedData: EditedData | null = null;
  public editedData: EditedData | null = null;
  
  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  public startEditRow(pageNumber: number | null, savedData: EditedData | null) {
    this.pageNumber = pageNumber;
    this.savedData = savedData;
    this.addedData = null;
    this.editedData = null;
  }
}