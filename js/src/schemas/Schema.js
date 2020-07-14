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
      if (options.rows)
        this.rows = options.rows;

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

      if (options.getDefaultValue)
        this.getDefaultValue = options.getDefaultValue;

      if (options.excludeInForm)
        this.excludeInForm = options.excludeInForm;

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

  get isLookup() {
    return this.lookupUrl || this.enums;
  }

  get defaultValue() {
    if (this.getDefaultValue) {
      console.log(this.name, this.getDefaultValue);
      const value = this.getDefaultValue();
      console.log(this.name, value);
      return value;
    }

    return '';
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

  hasFormControl(value) {
    return this.visibleInForm && (!this.readonly || value);
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

  addEnabled() {
    this.addField('Enabled', 'Voimassa', 'boolean', { required: true, getDefaultValue: () => true });
  }

  addTimestamps() {
    this.addField('CreatedAt', 'Luotu',    'datetime', { required: true, readonly: true, visibleInTable: false });
    this.addField('UpdatedAt', 'Muokattu', 'datetime', { readonly: true, visibleInTable: false });
  }

  initFormData() {
    const data = {}

    for (let field of this.fields)
      if (!field.excludeInForm)
        data[field.name] = field.defaultValue;

    return data;
  }

  jsonToData(row) {
    const data = {}

    for (let field of this.fields)
      if (field.primaryKey || !field.excludeInForm)
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
