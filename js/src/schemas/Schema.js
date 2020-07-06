export class Field {
  constructor(name, title, type, options) {
    this.name = name;
    this.title = title;
    this.type = type;

    if (options) {
      if (options.link)
        this.link = options.link;

      if (options.required)
        this.required = options.required;

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
}
