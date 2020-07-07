export class Field {
  constructor(name, type, options) {
    this.name = name;
    this.title = name;
    this.type = type;
    this.visibleInForm = true;

    // is not allowed to be empty
    // must be less or equal to 100
    // must be larger than or equal to 0

    if (options) {
      if (options.title)
        this.title = options.title;

      if (options.link)
        this.link = options.link;

      if (options.lookupFunc) {
        this.lookupFunc = options.lookupFunc;
        this.lookup = [];
      }

      if (options.required)
        this.required = options.required;

      if (options.visibleInForm)
        this.visibleInForm = options.visibleInForm;

      if (options.min)
        this.min = options.min;

      if (options.max)
        this.max = options.max;
    }
  }
}


export class Schema {
  constructor(name) {
    this.name = name;
    
    this.fields = [];
  }

  addField(name, title, options) {
    this.fields.push(new Field(name, title, options));
  }

  initFormData() {
    const data = {}

    for (let field of this.fields)
      data[field.name] = '';

    return data;
  }
}
