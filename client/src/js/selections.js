import axios from 'axios';
import { fuels as fuelTexts } from '@/tables/base';


class Query {
  constructor(sql) {
    this.sql = sql;
  }

  async execute() {
    return await axios.get('http://localhost:3000/api/query/Rows?table=Model&sql=' + this.sql);
  }
}


export default class Selections {
  constructor() {
    this.brands = [];
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

  filterByBrand(query) {
    query.sql += ' WHERE Brand ="' + this.brand + '"';
  }

  filterByYear(query) {
    query.sql += ' AND FirstYear <= ' + this.year + ' AND (' + this.year + ' <= LastYear OR LastYear IS NULL)';
  }

  filterByFuel(query) {
    query.sql += ' AND Fuel = ' + this.fuel;
  }

  filterByModel(query) {
    query.sql += ' AND Model = "' + this.model + '"';
  }

  async fillBrands() {
    const query = new Query('SELECT DISTINCT Brand FROM Model ORDER BY Brand');

    const response = await query.execute();
    const brands = [];

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
    const fuels = [];

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
    const models = [];

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
    const engineDisplacements = [];

    for (let row of response.data.rows)
      engineDisplacements.push(row.EngineDisplacement);

    this.engineDisplacements = engineDisplacements;
  }
}
