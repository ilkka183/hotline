export const TextAlign = {
  LEFT: 0,
  CENTER: 1,
  RIGHT: 2
}


export class SelectOption {
  constructor(value, text) {
    this.value = value;
    this.text = text;
  }
}


class Field {
  constructor(name, caption, options) {
    if (this.constructor === Field)
      throw new TypeError('Can not construct an abstract class');

    this.dataset = null;
    this.name = name;
    this.caption = caption;

    this.align = TextAlign.LEFT;
    this.default = undefined;
    this.hideInDialog = false;
    this.hideInGrid = false;
    this.lookupList = null;
    this.lookupSQL = null;
    this.primaryKey = false;
    this.foreignKey = false;
    this.readonly = false;
    this.required = false;

    if (options !== undefined) {
      if ('align' in options)
        this.align = options.align;

      if ('default' in options)
        this.default = options.default;

      if ('hideInDialog' in options)
        this.hideInDialog = options.hideInDialog;

      if ('hideInGrid' in options)
        this.hideInGrid = options.hideInGrid;

      if ('lookupSQL' in options)
        this.lookupSQL = options.lookupSQL;

      if ('primaryKey' in options)
        this.primaryKey = options.primaryKey;

      if ('foreignKey' in options)
        this.foreignKey = options.foreignKey;

      if ('readonly' in options)
        this.readonly = options.readonly;

      if ('required' in options)
        this.required = options.required;
    }
  }

  get database() {
    return this.dataset.database;
  }

  getAutoFocus() {
    return this == this.dataset.autoFocusField;
  }

  getType() {
    throw new TypeError('You have to implement the method getType()');
  }

  getInputTextLength() {
    return 10;
  }

  get alignRight() {
    return (this.align === TextAlign.RIGHT);
  }

  get alignCenter() {
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

  isNull(row) {
    return !row[this.name];
  }

  isValid(row) {
    if (this.required)
      return row[this.name] != undefined;

    return true;
  }

  displayText(row) {
    return row[this.name];
  }

  isVisibleInDialog(row) {
    return (!this.isReadOnly || row[this.name]) && !this.hideInDialog;
  }

  showDialogCaption() {
    return true;
  }

  dialogInputType() {
    if (this.hasLookup)
      return 'select';
    else
      return 'text';
  }

  get hasLookup() {
    return this.lookupList || this.lookupSQL;
  }

  async findLookupText(value) {
    if (this.lookupList) {
      if (value !== null)
        return this.lookupList[value].text;
      else
        return undefined;
    }
    else if (this.lookupSQL)
      return await this.dataset.getLookupText(this.lookupSQL, value);
  }

  async findLookupList() {
    if (!this.lookupList && this.lookupSQL) { 
      this.lookupList = await this.dataset.getLookupList(this.lookupSQL);
    }

    return this.lookupList;
  }
}


class BinaryField extends Field {
  constructor(name, caption, options) {
    super(name, caption, options);
  }

  getType() {
    return ArrayBuffer;
  }
}


class ImageField extends BinaryField {
  constructor(name, caption, options) {
    super(name, caption, options);
  }
}


class BooleanField extends Field {
  constructor(name, caption, options) {
    super(name, caption, options);
  }

  getType() {
    return Boolean;
  }

  displayText(row) {
    if (row[this.name])
      return 'kyllä';
    else
      return 'ei';
  }

  showDialogCaption() {
    return false;
  }

  dialogInputType() {
    return 'checkbox';
  }
}


class DateField extends Field {
  constructor(name, caption, options) {
    super(name, caption, options);
  }

  getType() {
    return Date;
  }

  displayText(row) {
    const value = row[this.name];

    if (value) {
      const date = new Date(value);
      return this.toDisplayString(date);
    }

    return null;
  }

  toDisplayString(date) {
    return date.toLocaleDateString();
  }

  getInputTextLength() {
    return 20;
  }
}


class DateTimeField extends DateField {
  constructor(name, caption, options) {
    super(name, caption, options);
  }

  toDisplayString(date) {
    return date.toLocaleString();
  }

  getInputTextLength() {
    return 20;
  }
}


class IntegerField extends Field {
  constructor(name, caption, options) {
    super(name, caption, options);

    if (options !== undefined) {
      if ('displayTexts' in options) {
        const list = [];

        for (let index in options.displayTexts)
          list.push(new SelectOption(index, options.displayTexts[index]));

        this.lookupList = list;
      }
    }
  }

  getType() {
    return Number;
  }
}


class AutoIncrementField extends IntegerField {
  constructor(name, caption, options) {
    super(name, caption, options);
  }
}


class StringField extends Field {
  constructor(name, caption, options) {
    super(name, caption, options);
    this.code = false;
    this.length = null;
    this.cols = null;
    this.rows = null;

    if (options !== undefined) {
      if ('code' in options)
        this.code = options.code;

      if ('length' in options)
        this.length = options.length;

      if ('cols' in options)
        this.cols = options.cols;

      if ('rows' in options)
        this.rows = options.rows;
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
  
  dialogInputType() {
    if (this.rows != null)
      return 'textarea';
    else
      return 'text';
  }
}


export class Dataset {
  constructor(database) {
    if (this.constructor === Dataset)
      throw new TypeError('Can not construct an abstract class');

    this.database = database;
    this.fields = [];
    this.model = null;
    this.autoFocusField = null;
  }

  get pageLimit() {
    return 10;
  }

  addField(field) {
    field.dataset = this;

    if ((this.autoFocusField == null) && !field.isReadOnly)
      this.autoFocusField = field;

    this.fields.push(field);
  }

  addAutoIncrementField(name, caption) {
    this.addField(new AutoIncrementField(name, caption, { required: true, readonly: true, primaryKey: true }));
  }

  addBooleanField(name, caption, options = undefined) {
    this.addField(new BooleanField(name, caption, options));
  }

  addDateField(name, caption, options = undefined) {
    this.addField(new DateField(name, caption, options));
  }

  addDateTimeField(name, caption, options = undefined) {
    this.addField(new DateTimeField(name, caption, options));
  }

  addImageField(name, caption, options = undefined) {
    this.addField(new ImageField(name, caption, options));
  }

  addIntegerField(name, caption, options = undefined) {
    this.addField(new IntegerField(name, caption, options));
  }

  addStringField(name, caption, options = undefined) {
    this.addField(new StringField(name, caption, options));
  }

  newRow() {
    let row = {};

    for (let field of this.fields) {
      let value = null;

      if (!field.isReadOnly && (field.default !== undefined))
        value = field.default;

      row[field.name] = value;
    }

    return row;
  }

  get primaryKeyField() {
    for (let field of this.fields)
      if (field.isPrimaryKey)
        return field;

    return null;
  }

  primaryKeys(row) {
    const keys = {};

    for (let field of this.fields)
      if (field.isPrimaryKey)
        keys[field.name] = row[field.name];

    return keys;
  }

  contentCaptionOf(row) {
    let text = '';

    for (let field of this.fields)
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

  primaryKeysEquals(row1, row2) {
    for (let field of this.fields)
      if ((field.isPrimaryKey) && (row1[field.name] != row2[field.name]))
        return false;

    return true;
  }
}


export const EditState = {
  ADD: 0,
  EDIT: 1,
  DELETE: 2
}


export class EditedData {
  constructor(table, row, state) {
    this.table = table;
    this.row = row;
    this.state = state;
  }
}


export class RestDatabase {
  constructor(host, path) {
    this.host = host;
    this.path = path;
    this.editedData = null;
  }

  get url() {
    return this.host + this.path;
  }
}
