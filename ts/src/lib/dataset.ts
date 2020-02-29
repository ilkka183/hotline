export enum TextAlign {
  LEFT,
  CENTER,
  RIGHT
}


export class SelectOption {
  public value: any;
  public text: string;

  constructor(value: any, text: string) {
    this.value = value;
    this.text = text;
  }
}


export abstract class Field {
  public dataset: Dataset | undefined;
  public name: string;
  public caption: string;
  public align: TextAlign = TextAlign.LEFT;
  public default: any = undefined;
  public hideInDialog: boolean = false;
  public hideInGrid: boolean = false;
  public primaryKey: boolean = false;
  public foreignKey: boolean = false;
  public readonly: boolean = false;
  public required: boolean = false;
  public lookupList: any = null;
  public lookupSQL: string = '';
  public onCellColor: any = null;

  constructor(name: string, caption: string, options: any) {
    if (this.constructor === Field)
      throw new TypeError('Can not construct an abstract class');

    this.name = name;
    this.caption = caption;

    if (options) {
      if ('align' in options)
        this.align = options['align'];

      if ('default' in options)
        this.default = options['default'];

      if ('hideInDialog' in options)
        this.hideInDialog = options['hideInDialog'];

      if ('hideInGrid' in options)
        this.hideInGrid = options['hideInGrid'];

      if ('lookupSQL' in options)
        this.lookupSQL = options['lookupSQL'];

      if ('primaryKey' in options)
        this.primaryKey = options['primaryKey'];

      if ('foreignKey' in options)
        this.foreignKey = options['foreignKey'];

      if ('readonly' in options)
        this.readonly = options['readonly'];

      if ('required' in options)
        this.required = options['required'];


      if ('onCellColor' in options)
        this.onCellColor = options['onCellColor'];
    }
  }

  get database(): RestDatabase | undefined {
    return this.dataset?.database;
  }

  getAutoFocus() {
    return this == this.dataset?.autoFocusField;
  }

  abstract getType(): any;

  getInputTextLength() {
    return 10;
  }

  get alignRight(): boolean {
    return (this.align === TextAlign.RIGHT);
  }

  get alignCenter(): boolean {
    return (this.align === TextAlign.CENTER);
  }

  get isCode() {
    return false;
  }

  get isPrimaryKey() {
    return this.primaryKey;
  }

  get isReadOnly() {
    return this.readonly;
  }

  isNull(row: any) {
    return row[this.name] === null;
  }

  isValid(row: any) {
    if (this.required)
      return row[this.name] != null;

    return true;
  }

  value(row: any) {
    return row[this.name];
  }

  displayText(row: any) {
    return row[this.name];
  }

  cellColor(row: any) {
    if (this.onCellColor)
      return this.onCellColor(row);

    return null;
  }

  showDialogCaption() {
    return true;
  }

  dialogInputType(): string {
    if (this.hasLookup)
      return 'select';
    else
      return 'text';
  }

  get hasLookup() {
    return this.lookupList || this.lookupSQL;
  }

  async findLookupText(value: any) {
    if (this.lookupList) {
      if (value !== null)
        return this.lookupList[value].text;
      else
        return undefined;
    }
    else if (this.lookupSQL)
      return await this.dataset?.getLookupText(this.lookupSQL, value);
  }

  async findLookupList() {
    if (!this.lookupList && this.lookupSQL) { 
      this.lookupList = await this.dataset?.getLookupList(this.lookupSQL);
    }

    return this.lookupList;
  }
}


class BinaryField extends Field {
  constructor(name: string, caption: string, options: any) {
    super(name, caption, options);
  }

  getType() {
    return ArrayBuffer;
  }
}


class ImageField extends BinaryField {
  constructor(name: string, caption: string, options: any) {
    super(name, caption, options);
  }
}


class BooleanField extends Field {
  constructor(name: string, caption: string, options: any) {
    super(name, caption, options);
  }

  getType() {
    return Boolean;
  }

  displayText(row: any): string {
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
  constructor(name: string, caption: string, options: any) {
    super(name, caption, options);
  }

  getType() {
    return Date;
  }

  displayText(row: any) {
    const value = row[this.name];

    if (value) {
      const date = new Date(value);
      return this.toDisplayString(date);
    }

    return null;
  }

  toDisplayString(date: Date) {
    return date.toLocaleDateString();
  }

  getInputTextLength() {
    return 20;
  }
}


class DateTimeField extends DateField {
  constructor(name: string, caption: string, options: any) {
    super(name, caption, options);
  }

  toDisplayString(date: Date) {
    return date.toLocaleString();
  }

  getInputTextLength() {
    return 20;
  }
}


class IntegerField extends Field {
  constructor(name: string, caption: string, options: any) {
    super(name, caption, options);

    if (options) {
      if ('displayTexts' in options) {
        const list = [];

        for (const index in options.displayTexts)
          list.push(new SelectOption(index, options.displayTexts[index]));

        this.lookupList = list;
      }
    }
  }

  getType() {
    return Number;
  }

  displayText(row: any) {
    if (this.lookupList) {
      const key = row[this.name];

      if (key !== null)
        return this.lookupList[key].text;
    }

    return super.displayText(row);
  }
}


class AutoIncrementField extends IntegerField {
  constructor(name: string, caption: string, options: any) {
    super(name, caption, options);
  }
}


class StringField extends Field {
  public code: boolean = false;
  public length: number | undefined;
  public cols: number | undefined;
  public rows: number | undefined;

  constructor(name: string, caption: string, options: any) {
    super(name, caption, options);

    if (options) {
      if ('code' in options)
        this.code = options['code'];

      if ('length' in options)
        this.length = options['length'];

      if ('cols' in options)
        this.cols = options['cols'];

      if ('rows' in options)
        this.rows = options['rows'];
    }
  }

  getType() {
    return String;
  }

  getInputTextLength() {
    if (this.length != null)
      return this.length;
    else
      return super.getInputTextLength();
  }

  get isCode() {
    return this.code;
  }

  getCols() {
    return this.cols;
  }
  
  getRows() {
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

  public get pageLimit(): number {
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

  protected addAutoIncrementField(name: string, caption: string) {
    this.addField(new AutoIncrementField(name, caption, { required: true, readonly: true, primaryKey: true }));
  }

  protected addBooleanField(name: string, caption: string, options: any = undefined) {
    this.addField(new BooleanField(name, caption, options));
  }

  protected addDateField(name: string, caption: string, options: any = undefined) {
    this.addField(new DateField(name, caption, options));
  }

  protected addDateTimeField(name: string, caption: string, options: any = undefined) {
    this.addField(new DateTimeField(name, caption, options));
  }

  protected addImageField(name: string, caption: string, options: any = undefined) {
    this.addField(new ImageField(name, caption, options));
  }

  protected addIntegerField(name: string, caption: string, options: any = undefined) {
    this.addField(new IntegerField(name, caption, options));
  }

  protected addStringField(name: string, caption: string, options: any = undefined) {
    this.addField(new StringField(name, caption, options));
  }

  newRow() {
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

  primaryKeys(row: any) {
    const keys: any = {};

    for (const field of this.fieldsAsArray)
      if (field.isPrimaryKey)
        keys[field.name] = row[field.name];

    return keys;
  }

  contentCaptionOf(row: any) {
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

  primaryKeysEquals(row1: any, row2: any) {
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
  ADD,
  EDIT,
  DELETE
}

export class EditedData {
  public table: any;
  public row: any;
  public state: EditState;
  
  constructor(table: any, row: any, state: EditState) {
    this.table = table;
    this.row = row;
    this.state = state;
  }
}


export class RestDatabase {
  public host: string;
  public path: string;
  public editedData: EditedData | null = null;
  
  constructor(host: string, path: string) {
    this.host = host;
    this.path = path;
  }

  get url(): string {
    return this.host + this.path;
  }
}
