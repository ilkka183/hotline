import axios from 'axios';
import { fuels as fuelTexts } from '@/tables/base';


class Query {
  public sql: string;

  constructor(sql: string) {
    this.sql = sql;
  }

  async execute() {
    return await axios.get('http://localhost:3000/api/query/Rows?table=Model&sql=' + this.sql);
  }
}


export default class Selections {
  public licenseNumber: string;

  public brand: any = null;
  public year: any = null;
  public fuel: any = null;
  public model: any = null;
  public engineDisplacement: any = null;

  public brands: any[] = [];
  public engineDisplacements: any[] = [];
  public years: any[] = [];
  public fuels: any[] = [];
  public models: any[] = [];

  constructor() {
    this.licenseNumber = 'ZLP-833',

    this.clear();
  }

  clear() {
    this.brand = null;
    this.year = null;
    this.fuel = null;
    this.model = null;
    this.engineDisplacement = null;

    this.years = [];
    this.fuels = [];
    this.models = [];
    this.engineDisplacements = [];
  }

  async findByLicenseNumber() {
    const response = await axios.get('http://localhost:3000/api/table/Vehicle/row?LicenseNumber=' + this.licenseNumber);
    
    if (response.data.length > 0) {
      const row = response.data[0];

      this.brand = row.Brand;
      this.model = row.Model;
      this.year = row.ModelYear;
      this.fuel = row.Fuel;
      this.engineDisplacement = row.EngineDisplacement;

      return true;
    }

    return false;
  }

  filterByBrand(query: Query) {
    query.sql += ' WHERE Brand ="' + this.brand + '"';
  }

  filterByYear(query: Query) {
    query.sql += ' AND FirstYear <= ' + this.year + ' AND (' + this.year + ' <= LastYear OR LastYear IS NULL)';
  }

  filterByFuel(query: Query) {
    query.sql += ' AND Fuel = ' + this.fuel;
  }

  filterByModel(query: Query) {
    query.sql += ' AND Model = "' + this.model + '"';
  }

  async fillBrands() {
    const query = new Query('SELECT DISTINCT Brand FROM Model ORDER BY Brand');

    const response = await query.execute();
    const brands: any[] = [];

    for (let row of response.data.rows)
      brands.push(row.Brand);

    this.brands = brands;
  }

  async fillYears() {
    const query = new Query('SELECT MIN(FirstYear) AS FirstYear, MAX(LastYear) AS LastYear FROM Model');
    this.filterByBrand(query);

    const response = await query.execute();
    const years = [];

    let firstYear = response.data.rows[0].FirstYear;
    let lastYear = response.data.rows[0].LastYear;

    if (lastYear == null)
      lastYear = 2020;

    for (let year = lastYear; year >= firstYear; year--)
      years.push(year);

    this.years = years;
  }

  async fillFuels() {
    const query = new Query('SELECT DISTINCT Fuel FROM Model');
    this.filterByBrand(query);
    this.filterByYear(query);

    const response = await query.execute();
    const fuels: any[] = [];

    for (let row of response.data.rows)
      fuels.push({ value: row.Fuel, text: fuelTexts[row.Fuel] });

    this.fuels = fuels;
  }

  async fillModels() {
    const query = new Query('SELECT DISTINCT Model FROM Model');
    this.filterByBrand(query);
    this.filterByYear(query);
    this.filterByFuel(query);
    
    const response = await query.execute();
    const models: any[] = [];

    for (let row of response.data.rows)
      models.push(row.Model);

    this.models = models;
  }

  async fillEngineDisplacements() {
    const query = new Query('SELECT DISTINCT EngineDisplacement FROM Model');
    this.filterByBrand(query);
    this.filterByYear(query);
    this.filterByFuel(query);
    this.filterByModel(query);

    const response = await query.execute();
    const engineDisplacements: any[] = [];

    for (let row of response.data.rows)
      engineDisplacements.push(row.EngineDisplacement);

    this.engineDisplacements = engineDisplacements;
  }
}
