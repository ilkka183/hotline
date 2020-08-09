import React from 'react';

export enum SortOrder { Asc, Desc }

type LinkFunc = (row: any) => string;
type RenderFunc = (row: any) => JSX.Element;
type DefaultValueFunc = () => any;

export interface LookupPair {
  value: any,
  text: string
}

interface FieldOptions {
  order?: SortOrder,
  link?: LinkFunc,
  render?: RenderFunc,
  getDefaultValue?: DefaultValueFunc,
  lookupUrl?: string,
  enums?: Array<string>,
  code?: boolean,
  primaryKey?: boolean,
  editLink?: boolean,
  required?: boolean,
  readonly?: boolean,
  visible?: boolean,
  search?: boolean,
  preformatted?: boolean,
  rows?: number,
  min?: number,
  max?: number,
  minLength?: number,
  displayFormat?: string,
}

export class Field {
  public index: number = -1;
  public readonly name: string;
  public label: string;
  public readonly type: string;
  public default: any = null;
  public readonly code: boolean = false;
  public readonly primaryKey: boolean = false;
  public readonly editLink: boolean = false;
  public visible: boolean = true;
  public readonly: boolean = false;
  public readonly required: boolean = false;
  public readonly preformatted: boolean = false;
  public readonly search: boolean = false;
  public rows?: number;
  public readonly min?: number;
  public readonly max?: number;
  public readonly minLength?: number;
  public order?: SortOrder;
  public readonly link?: LinkFunc;
  public readonly render?: RenderFunc;
  public getDefaultValue?: DefaultValueFunc;
  public displayFormat?: string;
  public lookupUrl?: string;
  public enums?: Array<string>;
  public lookup?: LookupPair[];
  
  constructor(name: string, label: string, type: string, options?: FieldOptions) {
    this.name = name;
    this.label = label;
    this.type = type;

    if (type === 'boolean')
      this.default = false;
    else
      this.default = '';

    if (options) {
      if (options.render !== undefined)
        this.render = options.render;

      if (options.link !== undefined)
        this.link = options.link;

      if (options.editLink !== undefined)
        this.editLink = options.editLink;

      if (options.lookupUrl !== undefined)
        this.lookupUrl = options.lookupUrl;

      if (options.enums !== undefined)
        this.enums = options.enums;

      if (options.code !== undefined)
        this.code = options.code;

      if (options.primaryKey !== undefined)
        this.primaryKey = options.primaryKey;

      if (options.required !== undefined)
        this.required = options.required;

      if (options.readonly !== undefined)
        this.readonly = options.readonly;

      if (options.preformatted !== undefined)
        this.preformatted = options.preformatted;

      if (options.search !== undefined)
        this.search = options.search;

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

  public get isString(): boolean {
    return this.type === 'text' || this.type === 'password';
  }

  public get isNumber(): boolean {
    return this.type === 'number' && !this.isLookup;
  }

  public get isLookup(): boolean {
    return this.lookupUrl !== undefined || this.enums !== undefined;
  }

  public get defaultValue(): any {
    if (this.getDefaultValue)
      return this.getDefaultValue();

    return '';
  }

  public formatBoolean(value: boolean): string {
    return value ? 'kyllä' : 'ei';
  }

  public formatDate(value: any): string | null {
    if (value) {
      const date = new Date(value);
      return date.toLocaleDateString();
    }
    
    return null;
  }

  public formatTime(value: any): string | null {
    if (value) {
      const date = new Date(value);
      return date.toLocaleTimeString();
    }
    
    return null;
  }

  public formatDateTime(value: any): string | null {
    if (value) {
      const date = new Date(value);
      return date.toLocaleString();
    }
    
    return null;
  }

  public lookupText(value: any): string | null {
    if (this.lookup) {
      const item: LookupPair | undefined = this.lookup.find(item => item.value === value);

      if (item)
        return item.text;
    }

    return null;
  }

  public formatValue(value: any): string | null {
    if (this.enums)
      return this.enums[value];

    if (this.lookup)
      return this.lookupText(value);

    switch (this.type) {
      case 'boolean': return this.formatBoolean(value);
      case 'date': return this.formatDate(value);
      case 'datetime': return this.displayFormat === 'date' ? this.formatDate(value) : this.formatDateTime(value);
      case 'time': return this.formatTime(value);
    }
    
    return value;
  }

  public validate(value: any): string | null {
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

  public hasFormControl(value: any): boolean {
    return this.visible && (!this.readonly || value);
  }

  public date_JsonToData(value: any) {
    return value.substring(0, 10);
  }

  public datetime_JsonToData(value: any) {
    return DateTimeField.toString(value);
  }

  public date_DataToJson(value: any) {
    const values = value.split('.');

    if (values.length === 3)
      return values[2] + '-' + values[1] + '-' + values[0];

    return value;
  }

  public jsonToData(value: any) {
    if (value === null)
      return '';

    switch (this.type) {
      case 'date': return this.date_JsonToData(value);
      case 'datetime': return this.datetime_JsonToData(value);
      case 'file': return '';
    }

    return value;
  }

  public dataToJson(value: any) {
    if (value === '')
      return null;

    switch (this.type) {
      case 'date': return this.date_DataToJson(value);
    }

    return value;
  }
}


export class DateTimeField extends Field {
  static toString(value: any) {
    if (value) {
      const date = new Date(value);
      return date.toLocaleString();
    }

    return null;
  }
}


export default class FieldsComponent<P, S> extends React.Component<P, S> {
  public fields: Field[] = [];

  protected findField(name: string): Field | null {
    for (const field of this.fields)
      if (field.name === name)
        return field;

    return null;
  }

  protected fieldByName(name: string): Field {
    const field: Field | null = this.findField(name);

    if (field === null)
      throw new Error(`Field ${name} not found`);

   return field;
  }

  protected addField(name: string, label: string, type: string, options?: FieldOptions): Field {
    const field: Field = new Field(name, label, type, options);
    field.index = this.fields.length;
    
    this.fields.push(field);
    return field;
  }
}
