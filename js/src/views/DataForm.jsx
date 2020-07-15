import { toast } from 'react-toastify';
import FieldsForm from '../components/common/FieldsForm';
import http from '../services/httpService';
import { apiUrl } from '../config.json';

export default class DataForm extends FieldsForm {
  jsonToData(row) {
    const data = {}

    for (let field of this.fields)
      data[field.name] = field.jsonToData(row[field.name]);

    return data;
  }

  enumsToLookup(enums) {
    const lookup = [{ Id: null, Name: '' }];

    for (const index in enums)
      lookup.push({ Id: index, Name: enums[index] });

    return lookup;
  }


  get dataId() {
    return this.props.match.params.id;
  }

  get apiEndpoint() {
    return apiUrl + '/' + this.getApiName();
  }

  apiEndpointOf(id) {
    return this.apiEndpoint + '/' + id;
  }

  async populateLookups() {
    for (const field of this.fields) {
      if (field.lookupUrl) {
        const { data } = await http.get(apiUrl + '/' + field.lookupUrl);
        const lookup = [{ Id: null, Name: '' }, ...data];
        field.lookup = lookup;

        this.setState({ lookup });
      }
      else if (field.enums) {
        const lookup = this.enumsToLookup(field.enums);
        field.lookup = lookup;

        this.setState({ lookup });
      }
    }
  }

  async loadData() {
    try {
      const { data: item } = await http.get(this.apiEndpointOf(this.dataId));

      const savedData = this.jsonToData(item)
      const data = this.jsonToData(item)

      console.log('json', item);
      console.log('data', data);

      this.setState({ savedData, data });
    }
    catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace('/not-found');
    }
  }

  setDefaultData() {
    const data = this.defaultData();
    console.log('new', data);

    this.setState({ data });
  }

  async componentDidMount() {
    this.populateLookups();

    if (this.dataId === 'new')
      this.setDefaultData()
    else
      await this.loadData();
  }

  afterSubmit() {
    this.props.history.goBack();
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
        }
        catch (ex) {
          toast.error(ex.response.data.sqlMessage);
        }
      }
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
      }
      catch (ex) {
        toast.error(ex.response.data.sqlMessage);
      }
    }

    this.afterSubmit();
  }
}
