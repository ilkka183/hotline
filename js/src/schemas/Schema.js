export class Field {
  constructor(name, label, type, options) {
    this.name = name;
    this.label = label;
    this.type = type;
    this.editLink = false;
    this.visibleInTable = true;
    this.visibleInForm = true;
    this.readonly = false;

    if (type === 'boolean')
      this.default = false;
    else
      this.default = '';

    if (options) {
      if (options.link)
        this.link = options.link;

      if (options.lookupUrl)
        this.lookupUrl = options.lookupUrl;

      if (options.enums)
        this.enums = options.enums;

      if (options.primaryKey)
        this.primaryKey = options.primaryKey;

      if (options.required)
        this.required = options.required;

      if (options.readonly)
        this.readonly = options.readonly;

      if (options.displayFormat)
        this.displayFormat = options.displayFormat;

      if (options.editLink)
        this.editLink = options.editLink;

      if (options.defaultValue)
        this.defaultValue = options.defaultValue;

      if (options.hasOwnProperty('visibleInTable'))
        this.visibleInTable = options.visibleInTable;

      if (options.hasOwnProperty('visibleInForm'))
        this.visibleInForm = options.visibleInForm;

      if (options.hasOwnProperty('min'))
        this.min = options.min;

      if (options.hasOwnProperty('max'))
        this.max = options.max;
    }
  }

  validate(value) {
    if (this.visibleInForm) {
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

  date_JsonToData(value) {
    const date = new Date(value);
    return date.toLocaleDateString();
  }

  datetime_JsonToData(value) {
    const date = new Date(value);
    return date.toLocaleString();
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


export class Schema {
  constructor(name) {
    this.name = name;
    
    this.fields = [];
  }

  get singularTitle() {
    throw new Error('You have to implement the get singularTitle() property!');
  }

  get pluralTitle() {
    throw new Error('You have to implement the get pluralTitle() property!');
  }

  get pluralName() {
    throw new Error('You have to implement the get pluralName() property!');
  }

  findField(name) {
    for (const field of this.fields)
      if (field.name === name)
        return field;

    return null;
  }

  addField(name, label, type, options) {
    this.fields.push(new Field(name, label, type, options));
  }

  addEnabled() {
    this.addField('Enabled', 'Voimassa', 'boolean', { required: true, defaultValue: true });
  }

  addTimestamps() {
    this.addField('CreatedAt', 'Luotu',    'datetime', { required: true, readonly: true, visibleInTable: false });
    this.addField('UpdatedAt', 'Muokattu', 'datetime', { readonly: true, visibleInTable: false });
  }

  initFormData() {
    const data = {}

    for (let field of this.fields)
      if (field.visibleInForm)
        data[field.name] = field.defaultValue ? field.defaultValue : '';

    return data;
  }

  jsonToData(row) {
    const data = {}

    for (let field of this.fields)
      if (field.primaryKey || field.visibleInForm)
        data[field.name] = field.jsonToData(row[field.name]);

    return data;
  }
}
