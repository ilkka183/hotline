export class Field {
  constructor(name, title, type, options) {
    this.name = name;
    this.title = title;
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

      if (options.lookupFunc) {
        this.lookupFunc = options.lookupFunc;
        this.lookup = [];
      }

      if (options.primaryKey)
        this.primaryKey = options.primaryKey;

      if (options.required)
        this.required = options.required;

      if (options.readonly)
        this.readonly = options.readonly;

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

  date_JsonToData(value) {
    const date = new Date(value);
    return date.toLocaleDateString();
  }

  date_DataToJson(value) {
    const values = value.split('.');

    if (values.length === 3)
      return values[2] + '-' + values[1] + '-' + values[0];

    return value;
  }

  jsonToData(value) {
    if (!value)
      return '';

    switch (this.type) {
      case 'date': return this.date_JsonToData(value);
      default: return value;
    }
  }

  dataToJson(value) {
    if (!value)
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

  addField(name, title, type, options) {
    this.fields.push(new Field(name, title, type, options));
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
    console.log(row);

    for (let field of this.fields)
      if (field.primaryKey || field.visibleInForm)
        data[field.name] = field.jsonToData(row[field.name]);

    return data;
  }
}
