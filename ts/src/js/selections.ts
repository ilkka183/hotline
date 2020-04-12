import axios from 'axios';
import { BaseTable } from '@/tables/base';


export default class Selections {
  public licenseNumber: string;

  public brand?: string = null;
  public year?: number = null;
  public fuel?: number = null;
  public model?: string = null;
  public engineSize?: number = null;

  public brands: string[] = [];
  public years: number[] = [];
  public fuels: object[] = [];
  public models: string[] = [];
  public engineSizes: number[] = [];

  constructor() {
    this.licenseNumber = 'ZLP-833',

    this.clear();
  }

  public clear() {
    this.brand = null;
    this.year = null;
    this.fuel = null;
    this.model = null;
    this.engineSize = null;

    this.years = [];
    this.fuels = [];
    this.models = [];
    this.engineSizes = [];
  }

  public async findByLicenseNumber() {
    const response = await axios.get('http://localhost:3000/api/traficom/' + this.licenseNumber);
    
    this.brand = response.data.carMake;
    this.model = response.data.carModel;
    this.year = response.data.registrationYear;

    switch (response.data.fuelType) {
      case 'bensiini':
        this.fuel = 0;
        break;
      }

    this.engineSize = response.data.engineSize;

    return true;
  }

  public async fillBrands() {
    const response = await axios.get('http://localhost:3000/api/data/brands');
    
    const brands: string[] = [];

    for (const brand of response.data)
      brands.push(brand);

    this.brands = brands;
  }

  public async fillYears() {
    const response = await axios.get('http://localhost:3000/api/data/years?brand=' + this.brand);

    const years: number[] = [];

    for (const year of response.data)
      years.push(year);

    this.years = years;
  }

  public async fillFuels() {
    const url = 'http://localhost:3000/api/data/fuels?brand=' + this.brand + '&year=' + this.year;
    const response = await axios.get(url);

    const fuels: object[] = [];

    for (const fuel of response.data)
      fuels.push({ value: fuel, text: BaseTable.FUELS[fuel] });

    this.fuels = fuels;
  }

  public async fillModels() {
    const url = 'http://localhost:3000/api/data/models?brand=' + this.brand + '&year=' + this.year + '&fuel=' + this.fuel;
    const response = await axios.get(url);

    const models: string[] = [];

    for (const model of response.data)
      models.push(model);

    this.models = models;
  }

  public async fillEngineSizes() {
    const url = 'http://localhost:3000/api/data/engineSizes?brand=' + this.brand + '&year=' + this.year + '&fuel=' + this.fuel + '&model=' + this.model;
    console.log(url);
    const response = await axios.get(url);

    const engineSizes: number[] = [];

    for (const engineSize of response.data)
      engineSizes.push(engineSize);

    this.engineSizes = engineSizes;
  }
}
