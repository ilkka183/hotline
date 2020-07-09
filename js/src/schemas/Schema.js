export class Field {
  constructor(name, title, type, options) {
    this.name = name;
    this.title = title;
    this.type = type;
    this.editLink = false;
    this.visibleInTable = true;
    this.visibleInForm = true;

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
}


export class Schema {
  constructor(name) {
    this.name = name;
    
    this.fields = [];
  }

  addField(name, title, type, options) {
    this.fields.push(new Field(name, title, type, options));
  }

  initFormData() {
    const data = {}

    for (let field of this.fields)
      if (field.visibleInForm)
        data[field.name] = field.defaultValue ? field.defaultValue : '';

    return data;
  }

  mapFormData(row) {
    const data = {}

    for (let field of this.fields)
      if (field.primaryKey || field.visibleInForm) {
        const value = row[field.name];
        data[field.name] = value ? value : '';
      }

    return data;
  }
}
