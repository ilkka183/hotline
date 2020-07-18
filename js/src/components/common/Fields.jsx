import { Component } from 'react';

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

      if (options.minLength !== undefined)
        this.minLength = options.minLength;
    }
  }

  get isString() {
    return this.type === 'text' || this.type === 'password';
  }

  get isNumber() {
    return this.type === 'number' && !this.isLookup;
  }

  get isLookup() {
    return this.lookupUrl || this.enums;
  }

  get defaultValue() {
    if (this.getDefaultValue)
      return this.getDefaultValue();

    return '';
  }

  formatBoolean(value) {
    return value ? 'kyllä' : 'ei';
  }

  formatDate(value) {
    if (value) {
      const date = new Date(value);
      return date.toLocaleDateString();
    }
    
    return null;
  }

  formatTime(value) {
    if (value) {
      const date = new Date(value);
      return date.toLocaleTimeString();
    }
    
    return null;
  }

  formatDateTime(value) {
    if (value) {
      const date = new Date(value);
      return date.toLocaleString();
    }
    
    return null;
  }

  formatValue(value) {
    if (this.enums)
      return this.enums[value];

    switch (this.type) {
      case 'boolean': return this.formatBoolean(value);
      case 'date': return this.formatDate(value);
      case 'datetime': return this.displayFormat === 'date' ? this.formatDate(value) : this.formatDateTime(value);
      case 'time': return this.formatTime(value);
      
      default: return value;
    }
  }

  lookupText(value) {
    if (this.lookup) {
      const item = this.lookup.find(item => item.value === value);

      if (item)
        return item.text;
    }

    return null;
  }

  validate(value) {
    if (this.visible && !this.readonly) {
      if (this.required && this.type !== 'boolean' && value === '')
        return this.label + ' ei voi olla tyhjä';

      if (value) {
        if (this.min !== undefined && value < this.min)
          return this.label + ' pitää olla suurempi tai saman suuruinen kuin ' + this.min;

        if (this.max !== undefined && value > this.max)
          return this.label + ' pitää olla pienempi tai saman suuruinen kuin ' + this.max;

        if (this.minLength !== undefined && this.isString && value.length < this.minLength)
          return this.label + ' pituus pitää olla vähintään ' + this.minLength + ' merkkiä';
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


export default class FieldsComponent extends Component {
  fields = [];

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
    field.index = this.fields.length;
    
    this.fields.push(field);
    return field;
  }
}
