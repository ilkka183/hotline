import axios from 'axios';
import { BaseTable } from '@/tables/base';


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

  public brand?: string = null;
  public year?: number = null;
  public fuel?: number = null;
  public model?: string = null;
  public engineDisplacement?: number = null;

  public brands: string[] = [];
  public years: number[] = [];
  public fuels: object[] = [];
  public models: string[] = [];
  public engineDisplacements: number[] = [];

  constructor() {
    this.licenseNumber = 'ZLP-833',

    this.clear();
  }

  public clear() {
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

  public async findByLicenseNumber() {
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

  public filterByBrand(query: Query) {
    query.sql += ' WHERE Brand ="' + this.brand + '"';
  }

  public filterByYear(query: Query) {
    query.sql += ' AND FirstYear <= ' + this.year + ' AND (' + this.year + ' <= LastYear OR LastYear IS NULL)';
  }

  public filterByFuel(query: Query) {
    query.sql += ' AND Fuel = ' + this.fuel;
  }

  public filterByModel(query: Query) {
    query.sql += ' AND Model = "' + this.model + '"';
  }

  public async fillBrands() {
    const query = new Query('SELECT DISTINCT Brand FROM Model ORDER BY Brand');

    const response = await query.execute();
    const brands: string[] = [];

    for (const row of response.data.rows)
      brands.push(row.Brand);

    this.brands = brands;
  }

  public async fillYears() {
    const query = new Query('SELECT MIN(FirstYear) AS FirstYear, MAX(LastYear) AS LastYear FROM Model');
    this.filterByBrand(query);

    const response = await query.execute();
    const years: number[] = [];

    const firstYear = response.data.rows[0].FirstYear;
    let lastYear = response.data.rows[0].LastYear;

    if (lastYear == null)
      lastYear = 2020;

    for (let year = lastYear; year >= firstYear; year--)
      years.push(year);

    this.years = years;
  }

  public async fillFuels() {
    const query = new Query('SELECT DISTINCT Fuel FROM Model');
    this.filterByBrand(query);
    this.filterByYear(query);

    const response = await query.execute();
    const fuels: object[] = [];

    for (const row of response.data.rows)
      fuels.push({ value: row.Fuel, text: BaseTable.FUELS[row.Fuel] });

    this.fuels = fuels;
  }

  public async fillModels() {
    const query = new Query('SELECT DISTINCT Model FROM Model');
    this.filterByBrand(query);
    this.filterByYear(query);
    this.filterByFuel(query);
    
    const response = await query.execute();
    const models: string[] = [];

    for (const row of response.data.rows)
      models.push(row.Model);

    this.models = models;
  }

  public async fillEngineDisplacements() {
    const query = new Query('SELECT DISTINCT EngineDisplacement FROM Model');
    this.filterByBrand(query);
    this.filterByYear(query);
    this.filterByFuel(query);
    this.filterByModel(query);

    const response = await query.execute();
    const engineDisplacements: number[] = [];

    for (const row of response.data.rows)
      engineDisplacements.push(row.EngineDisplacement);

    this.engineDisplacements = engineDisplacements;
  }
}
