import axios from 'axios';
import { apiUrl } from '../config.json';

const apiEndpoint = apiUrl + '/data'

export function getBrands() {
  return axios.get(apiEndpoint + '/brands')
}

export function getYears(brand: string) {
  return axios.get(apiEndpoint + '/years?brand=' + brand)
}

export function getFuels(brand: string, year: number) {
  return axios.get(apiEndpoint + '/fuels?brand=' + brand + '&year=' + year)
}

export function getModels(brand: string, year: number, fuel: number) {
  return axios.get(apiEndpoint + '/models?brand=' + brand + '&year=' + year + '&fuel=' + fuel)
}

export function getEngineSizes(brand: string, year: number, fuel: number, model: string) {
  return axios.get(apiEndpoint + '/engineSizes?brand=' + brand + '&year=' + year + '&fuel=' + fuel + '&model=' + model)
}
