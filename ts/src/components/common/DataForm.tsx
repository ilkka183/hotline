import { LookupPair } from './Fields';
import FieldsForm, { FormErrors } from './FieldsForm';

interface Props {
  dataId?: number,
  data?: any,
  defaultData?: any
}

export default abstract class DataForm<P> extends FieldsForm<P & Props> {
  protected get dataId(): number | undefined {
    return this.getDataId();
  }

  protected getDataId(): number | undefined {
    return this.props.dataId;
  }

  protected abstract getHttp(): any;

  public get http(): any {
    return this.getHttp();
  }

  protected abstract getApiName(): string;

  public get apiEndpoint(): string {
    return '/' + this.getApiName();
  }

  public apiEndpointOf(id: number): string {
    return this.apiEndpoint + '/' + id;
  }

  public getData(): any {
    if (this.props.data)
      return this.props.data;
    else
      return this.state.data;
  }

  protected formatDateTimes(): boolean {
    return this.props.data !== undefined;
  }

  protected abstract getNewTitle(): string;
  protected abstract getEditTitle(): string;
  protected abstract getDeleteTitle(): string;

  public getTitle(): string {
    const { action } = this.props;

    switch (action) {
      case 'new': return this.getNewTitle();
      case 'edit': return this.getEditTitle();
      case 'delete': return this.getDeleteTitle();
    }

    return '';
  }

  private async populateLookups() {
    for (const field of this.fields) {
      if (field.lookupUrl) {
        const { data: { rows } } = await this.http.get('/' + field.lookupUrl);

        const lookup: LookupPair[] = [{ value: null, text: '' }];

        for (const row of rows)
          lookup.push({ value: row.Id, text: row.Name });

        field.lookup = lookup;

//        this.setState({ lookup });
      }
      else if (field.enums) {
        const lookup: LookupPair[] = [{ value: null, text: '' }];

        let value: number = 0;

        for (const text of field.enums) {
          lookup.push({ value, text });
          value++;
        }

        field.lookup = lookup;

//        this.setState({ lookup });
      }
    }
  }

  private async populateData() {
    const errors: any = {};

    if (this.dataId) {
      // Fetch data from database
      try {
        const { data: item } = await this.http.get(this.apiEndpointOf(this.dataId));
  
        console.log(item);

        const savedData: any = this.jsonToData(item);
        const data: any = this.jsonToData(item);

        console.log(data);

        this.setState({ savedData, data, errors });
      }
      catch (ex) {
        if (ex.response && ex.response.status === 404) {
//          this.props.history.replace('/not-found');
        }
      }
    }
    else if (this.props.defaultData) {
      // Copy data from props
      const data: any = {...this.state.data};

      for (const name in data) {
        const defaultData: any = this.props.defaultData;
        const value: any = defaultData[name];

        data[name] = (value !== undefined && value !== null) ? value : '';
      }
  
      this.setState({ data, errors });
    }
    else {
      // New data
      const data: any = this.getDefaultData();
  
      this.setState({ data, errors });
    }
  }

  public async componentDidMount() {
    await this.populateLookups();
    await this.populateData();
  }

  protected async doSubmit(): Promise<FormErrors | null> {
    const data: any = this.state.data;

    if (data.Id) {
      // PUT
      const savedData: any = this.state.savedData;

      const row: any = {};
      
      for (const field of this.fields) {
        const value: any = data[field.name];
        const savedValue: any = savedData[field.name];

        if (value !== savedValue)
          row[field.name] = field.dataToJson(value);
      }

      if (Object.keys(row).length > 0) {
        try {
          console.log('put', row);
          await this.http.put(this.apiEndpointOf(data.Id), row);
        }
        catch (ex) {
          return {
            errorText: ex.response.data.sqlMessage
          };
        }
      }
    }
    else {
      // POST
      try {
        const row: any = {};
        
        for (const field of this.fields) {
          const value: any = data[field.name];

          if (value !== null && value !== '')
            row[field.name] = field.dataToJson(value);
        }

        console.log('post', row);
        await this.http.post(this.apiEndpoint, row);
      }
      catch (ex) {
        return {
          errorText: ex.response.data.sqlMessage
        };
      }
    }

    return null;
  }
}
