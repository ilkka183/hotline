export class Field {
  constructor(name, label, type, options) {
    this.name = name;
    this.label = label;
    this.type = type;
    this.editLink = false;
    this.visible = true;
    this.readonly = false;

    if (type === 'boolean')
      this.default = false;
    else
      this.default = '';

    if (options) {
      if (options.link !== undefined)
        this.link = options.link;

      if (options.editLink !== undefined)
        this.editLink = options.editLink;

      if (options.lookupUrl !== undefined)
        this.lookupUrl = options.lookupUrl;

      if (options.enums !== undefined)
        this.enums = options.enums;

      if (options.primaryKey !== undefined)
        this.primaryKey = options.primaryKey;

      if (options.required !== undefined)
        this.required = options.required;

      if (options.readonly !== undefined)
        this.readonly = options.readonly;

      if (options.displayFormat !== undefined)
        this.displayFormat = options.displayFormat;

      if (options.rows !== undefined)
        this.rows = options.rows;

      if (options.getDefaultValue !== undefined)
        this.getDefaultValue = options.getDefaultValue;

      if (options.visible !== undefined)
        this.visible = options.visible;

      if (options.min !== undefined)
        this.min = options.min;

      if (options.max !== undefined)
        this.max = options.max;
    }
  }

  get isLookup() {
    return this.lookupUrl || this.enums;
  }

  get defaultValue() {
    if (this.getDefaultValue)
      return this.getDefaultValue();

    return '';
  }

  validate(value) {
    if (this.visible) {
      if (this.required && this.type !== 'boolean' && value === '')
        return this.label + ' is not allowed to be empty';

      if (value) {
        if (this.min !== undefined && value < this.min)
          return this.label + ' must be larger than or equal to ' + this.min;

        if (this.max !== undefined && value > this.max)
          return this.label + ' must be less or equal to ' + this.max;
      }
    }

    return null;
  }

  hasFormControl(value) {
    return this.visible && (!this.readonly || value);
  }

  date_JsonToData(value) {
    return value.substring(0, 10);
  }

  datetime_JsonToData(value) {
    return DateTimeField.toString(value);
  }

  date_DataToJson(value) {
    const values = value.split('.');

    if (values.length === 3)
      return values[2] + '-' + values[1] + '-' + values[0];

    return value;
  }

  jsonToData(value) {
    if (value === null)
      return '';

    switch (this.type) {
      case 'date': return this.date_JsonToData(value);
      case 'datetime': return this.datetime_JsonToData(value);
      default: return value;
    }
  }

  dataToJson(value) {
    if (value === '')
      return null;

    switch (this.type) {
      case 'date': return this.date_DataToJson(value);
      default: return value;
    }
  }
}


export class DateTimeField extends Field {
  static toString(value) {
    if (value) {
      const date = new Date(value);
      return date.toLocaleString();
    }

    return null;
  }
}


export class Schema {
  constructor(api, title) {
    this.api = api;
    this.title = title;
    this.fields = [];
  }

  findField(name) {
    for (const field of this.fields)
      if (field.name === name)
        return field;

    return null;
  }

  fieldByName(name) {
    const field = this.findField(name);

    if (field === null)
      throw new Error(`Field ${name} not found`);

   return field;
  }

  addField(name, label, type, options) {
    const field = new Field(name, label, type, options);
    this.fields.push(field);
    return field;
  }

  emptyData() {
    const data = {}

    for (let field of this.fields)
      data[field.name] = '';

    return data;
  }

  defaultData() {
    const data = {}

    for (let field of this.fields)
      data[field.name] = field.defaultValue;

    return data;
  }

  jsonToData(row) {
    const data = {}

    for (let field of this.fields)
      data[field.name] = field.jsonToData(row[field.name]);

    return data;
  }

  static enumsToLookup(enums) {
    const lookup = [{ Id: null, Name: '' }];

    for (const index in enums)
      lookup.push({ Id: index, Name: enums[index] });

    return lookup;
  }
}
