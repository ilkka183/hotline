import { toast } from 'react-toastify';
import FieldsForm from './FieldsForm';

export default class DataForm extends FieldsForm {
  get dataId() {
    const { dataId, match } = this.props;

    if (dataId)
      return dataId;
    else if (match && match.params.id !== 'new')
      return match.params.id;

    return undefined;
  }

  getApiName() {
    throw new Error('You have to implement the method getApiName!');
  }

  getHttp() {
    throw new Error('You have to implement the method getHttp!');
  }

  get http() {
    return this.getHttp();
  }

  get apiEndpoint() {
    return '/' + this.getApiName();
  }

  apiEndpointOf(id) {
    return this.apiEndpoint + '/' + id;
  }

  getData() {
    if (this.props.data)
      return this.props.data;
    else
      return this.state.data;
  }

  async populateLookups() {
    for (const field of this.fields) {
      if (field.lookupUrl) {
        const { data: { rows } } = await this.http.get('/' + field.lookupUrl);

        const lookup = [{ value: null, text: '' }];

        for (const row of rows)
          lookup.push({ value: row.Id, text: row.Name });

        field.lookup = lookup;

        this.setState({ lookup });
      }
      else if (field.enums) {
        const lookup = [{ value: null, text: '' }];

        let value = 0;

        for (const text of field.enums) {
          lookup.push({ value, text });
          value++;
        }

        field.lookup = lookup;

        this.setState({ lookup });
      }
    }
  }

  async populateData() {
    const errors = {};

    if (this.dataId) {
      // Fetch data from database
      try {
        const { data: item } = await this.http.get(this.apiEndpointOf(this.dataId));
  
        const savedData = this.jsonToData(item)
        const data = this.jsonToData(item)
  
        this.setState({ savedData, data, errors });
      }
      catch (ex) {
        if (ex.response && ex.response.status === 404)
          this.props.history.replace('/not-found');
      }
    }
    else if (this.props.defaultData) {
      // Copy data from props
      const data = {...this.state.data};

      for (const name in data) {
        const value = this.props.defaultData[name];

        data[name] = (value !== undefined && value !== null) ? value : '';
      }
  
      this.setState({ data, errors });
    }
    else {
      // New data
      const data = this.getDefaultData();
  
      this.setState({ data, errors });
    }
  }

  async populate() {
    await this.populateLookups();
    await this.populateData();
  }

  async componentDidMount() {
    await this.populate();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.dataId !== this.props.dataId) {
      await this.populate();
    }
  }

  async doSubmit() {
    const { data } = this.state;

    if (data.Id) {
      // PUT
      const { savedData } = this.state;

      const row = {};
      
      for (let field of this.fields) {
        const value = data[field.name];
        const savedValue = savedData[field.name];

        if (value !== savedValue)
          row[field.name] = field.dataToJson(value);
      }

      if (Object.keys(row).length > 0) {
        try {
          console.log('put', row);
          await this.http.put(this.apiEndpointOf(data.Id), row);
          this.afterSubmit();
        }
        catch (ex) {
          toast.error(ex.response.data.sqlMessage);
        }
      }
      else
        this.afterSubmit();
    }
    else {
      // POST
      try {
        const row = {};
        
        for (let field of this.fields) {
          const value = data[field.name];

          if (value !== null && value !== '')
            row[field.name] = field.dataToJson(value);
        }

        console.log('post', row);
        await this.http.post(this.apiEndpoint, row);
        this.afterSubmit();
      }
      catch (ex) {
        toast.error(ex.response.data.sqlMessage);
      }
    }
  }

  afterSubmit() {
  }
}
