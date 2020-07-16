import { toast } from 'react-toastify';
import FieldsForm from '../components/common/FieldsForm';
import http from '../services/httpService';
import { apiUrl } from '../config.json';

export default class DataForm extends FieldsForm {
  get dataId() {
    if (this.props.match && this.props.match.params.id !== 'new')
      return this.props.match.params.id;

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

  get apiEndpoint() {
    return apiUrl + '/' + this.getApiName();
  }

  apiEndpointOf(id) {
    return this.apiEndpoint + '/' + id;
  }

  async populateLookups() {
    const setLookup = (field, data) => {
      const lookup = [{ Id: null, Name: '' }, ...data];
      field.lookup = lookup;
  
      this.setState({ lookup });
    }
    
    for (const field of this.fields) {
      if (field.lookupUrl) {
        const { data } = await http.get(apiUrl + '/' + field.lookupUrl);

        setLookup(field, data);
      }
      else if (field.enums) {
        const data = [];

        for (const Id in field.enums)
          data.push({ Id, Name: field.enums[Id] });

        setLookup(field, data);
      }
    }
  }

  async populateData() {
    if (this.dataId) {
      // Load data
      try {
        const { data: item } = await http.get(this.apiEndpointOf(this.dataId));
  
        const savedData = this.jsonToData(item)
        const data = this.jsonToData(item)
  
        this.setState({ savedData, data });
      }
      catch (ex) {
        if (ex.response && ex.response.status === 404)
          this.props.history.replace('/not-found');
      }
    }
    else {
      // Set new data
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

        if (value !== savedData[field.name])
          row[field.name] = field.dataToJson(value);
      }

      if (Object.keys(row).length > 0) {
        try {
          console.log('put', row);
          await http.put(this.apiEndpointOf(data.Id), row);
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

          if (value)
            row[field.name] = field.dataToJson(value);
        }

        console.log('post', row);
        await http.post(this.apiEndpoint, row);
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
