import { AxiosInstance } from 'axios';

export enum TextAlign {
  Left,
  Center,
  Right
}


export class SelectOption {
  public value: any;
  public text: string;

  constructor(value: any, text: string) {
    this.value = value;
    this.text = text;
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
  lookupSQL?: string;
  onCellColor?: any;
}


export abstract class Field {
  public dataset: Dataset | undefined;
  public name: string;
  public caption: string;
  public align: TextAlign = TextAlign.Left;
  public default: any = undefined;
  public hideInDialog = false;
  public hideInGrid = false;
  public primaryKey = false;
  public foreignKey = false;
  public readonly = false;
  public required = false;
  public lookupList: any = null;
  public lookupSQL = '';
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

    if (params.lookupSQL)
      this.lookupSQL = params.lookupSQL;

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

  isNull(row: object): boolean {
    return row[this.name] === null;
  }

  isValid(row: object): boolean {
    if (this.required)
      return row[this.name] != null;

    return true;
  }

  value(row: object): any {
    return row[this.name];
  }

  displayText(row: object): string {
    return row[this.name];
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
    if (this.hasLookup)
      return 'select';
    else
      return 'text';
  }

  get hasLookup(): boolean {
    return this.lookupList || this.lookupSQL;
  }

  async findLookupText(value: any) {
    if (this.lookupList && value !== null)
      return this.lookupList[value].text;
    else if (this.dataset && this.lookupSQL)
      return await this.dataset.getLookupText(this.lookupSQL, value);

    return undefined;
  }

  async findLookupList() {
    if (!this.lookupList && this.dataset && this.lookupSQL)
      this.lookupList = await this.dataset.getLookupList(this.lookupSQL);

    return this.lookupList;
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

  displayText(row: object): string {
    if (row[this.name])
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

  displayText(row: object): string {
    const value = row[this.name];

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
  displayTexts?: string[];
}


class IntegerField extends Field {
  constructor(params: IntegerFieldParams) {
    super(params);

    if (params.displayTexts) {
      const list: SelectOption[] = [];

      for (const index in params.displayTexts)
        list.push(new SelectOption(index, params.displayTexts[index]));

      this.lookupList = list;
    }
  }

  public getType(): any {
    return Number;
  }

  displayText(row: object): string {
    if (this.lookupList) {
      const key = row[this.name];

      if (key !== null)
        return this.lookupList[key].text;
    }

    return super.displayText(row);
  }
}


class AutoIncrementField extends IntegerField {
  constructor(params: FieldParams) {
    super(params);
    
    this.primaryKey = true;
  }
}


interface StringFieldParams extends FieldParams {
  code?: boolean;
  length?: number;
  cols?: number;
  rows?: number;
}


class StringField extends Field {
  public code = false;
  public length: number | undefined;
  public cols: number | undefined;
  public rows: number | undefined;

  constructor(params: StringFieldParams) {
    super(params);

    if (params.code)
      this.code = params.code;

    if (params.length)
      this.length = params.length;

    if (params.cols)
      this.cols = params.cols;

    if (params.rows)
      this.rows = params.rows;
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

  getCols(): number {
    return this.cols;
  }
  
  getRows(): number {
    return this.rows;
  }
  
  dialogInputType(): string {
    if (this.rows != null)
      return 'textarea';
    else
      return 'text';
  }
}


export abstract class Dataset {
  public database: RestDatabase;  
  public fields: any = {};
  public model: any = null;
  public autoFocusField: Field | null = null;

  constructor(database: RestDatabase) {
    this.database = database;
  }

  get axios(): AxiosInstance {
    return this.database.axios;
  }  

  public get pageLimit(): number {
    return this.getPageLimit();
  }

  protected getPageLimit(): number {
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

  public newRow(): any {
    const row: any = {};

    for (const field of this.fieldsAsArray) {
      let value = null;

      if (!field.isReadOnly && (field.default !== undefined))
        value = field.default;

      row[field.name] = value;
    }

    return row;
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

  public async findLookupLists(): Promise<void> {
    for (const field of this.fieldsAsArray)
      await field.findLookupList();
  }

  public async abstract getLookupText(sql: string, id: any): Promise<string>;
  public async abstract getLookupList(sql: string): Promise<any>;
}


export enum EditState {
  Add,
  Edit,
  Delete
}

export class EditedData {
  public table: any;
  public row: object;
  public state: EditState;
  
  constructor(table: any, row: object, state: EditState) {
    this.table = table;
    this.row = row;
    this.state = state;
  }
}


export class RestDatabase {
  public axios: AxiosInstance;
  public editedData: EditedData | null = null;
  
  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }
}