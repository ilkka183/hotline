import axios from 'axios';
import { apiUrl } from '../config.json';

const apiEndpoint = apiUrl + '/traficom'

export function getTraficom(licenseNumber: string) {
  return axios.get(apiEndpoint + '/' + licenseNumber)
}
