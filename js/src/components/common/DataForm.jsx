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

  get formattedTitle() {
    let title = this.getTitle();

    if (!this.dataId)
      title += ' - uusi';

    return title;
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

  async populateLookups() {
    for (const field of this.fields) {
      if (field.lookupUrl) {
        const { data } = await this.http.get('/' + field.lookupUrl);

        const lookup = [{ value: null, text: '' }];

        for (const item of data)
          lookup.push({ value: item.Id, text: item.Name });

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
    if (this.dataId) {
      // Fetch data from database
      try {
        const { data: item } = await this.http.get(this.apiEndpointOf(this.dataId));
  
        const savedData = this.jsonToData(item)
        const data = this.jsonToData(item)
  
        this.setState({ savedData, data });
      }
      catch (ex) {
        if (ex.response && ex.response.status === 404)
          this.props.history.replace('/not-found');
      }
    }
    else if (this.props.data) {
      // Copy data from props
      const data = {...this.state.data};

      for (const name in data) {
        const value = this.props.data[name];

        data[name] = (value !== undefined && value !== null) ? value : '';
      }
  
      this.setState({ data });
    }
    else {
      // New data
      const data = this.getDefaultData();
  
      this.setState({ data });
    }
  }

  async componentDidMount() {
    this.populateLookups();
    this.populateData();
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
