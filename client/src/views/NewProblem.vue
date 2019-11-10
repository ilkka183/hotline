<template>
  <div>
    <h1>Lisää uusi vikatapaus</h1>
    <button @click="setMethod(0)">Hae rekisterinumerolla</button>
    <button @click="setMethod(1)">Ohjattu syöttö</button>
    <button @click="setMethod(2)">Manuaalinen syöttö</button>
    <div v-if="method == 0">
      <label for="licenseNumber">Rekisterinumero:</label>
      <input id="licenseNumber" type="text" v-model="licenseNumber">
      <button @click="searchByLicenseNumber" :disabled="licenseNumber == ''">Hae</button>
      <button @click="clearLicenseNumber" :disabled="licenseNumber == ''">Tyhjennä</button>
    </div>
    <div v-if="method == 1">
      <table>
        <tr>
          <td><label for="brand">Merkki:</label></td>
          <td>
            <select id="brand" v-model="brand" @change="fillYears">
              <option :value="null">-</option>
              <option v-for="brand in brands" :key="brand">{{brand}}</option>
            </select>
          </td>
        </tr>
        <tr>
          <td><label for="modelYear">Vuosimalli:</label></td>
          <td>
            <select id="modelYear" v-model="year" @change="fillFuels">
              <option :value="null">-</option>
              <option v-for="year in years" :key="year">{{year}}</option>
            </select>
          </td>
        </tr>
        <tr>
          <td><label for="fuel">Käyttövoima:</label></td>
          <td>
            <select id="fuel" v-model="fuel" @change="fillModels">
              <option :value="null">-</option>
              <option v-for="fuel in fuels" :key="fuel.value" :value="fuel.value">{{fuel.text}}</option>
            </select>
          </td>
        </tr>
        <tr>
          <td><label for="model">Malli:</label></td>
          <td>
            <select id="model" v-model="model" @change="fillEngineDisplacements">
              <option :value="null">-</option>
              <option v-for="model in models" :key="model">{{model}}</option>
            </select>
          </td>
        </tr>
        <tr>
          <td><label for="engineDisplacement">Iskutilavuus:</label></td>
          <td>
            <select id="engineDisplacement" v-model="engineDisplacement">
              <option :value="null">-</option>
              <option v-for="engineDisplacement in engineDisplacements" :key="engineDisplacement">{{engineDisplacement}}</option>
            </select>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <button :disabled="engineDisplacement == null" @click="post">Jatka</button>
            <button @click="clear">Tyhjennä</button>
          </td>
        </tr>
      </table>
    </div>
    <div v-if="method == 2">
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { fuels as fuelTexts } from '@/tables/base';

export default {
  props: {
    database: { type: Object, required: true }
  },
  data() {
    return {
      method: null,
      licenseNumber: 'ZLP-833',
      brand: null,
      brands: [],
      year: null,
      years: [],
      fuel: null,
      fuels: [],
      model: null,
      models: [],
      engineDisplacement: null,
      engineDisplacements: [],
    }
  },
  methods: {
    async setMethod(value) {
      this.method = value;

      if (value == 1)
        await this.fillBrands();
    },
    async fillBrands() {
      let sql = 'SELECT DISTINCT Brand FROM Model ORDER BY Brand';

      const response = await axios.get('http://localhost:3000/api/query/Rows?table=Model&sql=' + sql);
      const brands = [];

      for (let row of response.data.rows)
        brands.push(row.Brand);

      this.brands = brands;
    },
    async fillYears() {
      let sql = 'SELECT MIN(FirstYear) AS FirstYear, MAX(LastYear) AS LastYear FROM Model';
      sql += ' WHERE Brand ="' + this.brand + '"';

      const response = await axios.get('http://localhost:3000/api/query/Rows?table=Model&sql=' + sql);
      const years = [];

      let firstYear = response.data.rows[0].FirstYear;
      let lastYear = response.data.rows[0].LastYear;

      if (lastYear == null)
        lastYear = 2020;

      for (let year = lastYear; year >= firstYear; year--)
        years.push(year);

      this.years = years;
    },
    async fillFuels() {
      let sql = 'SELECT DISTINCT Fuel FROM Model';
      sql += ' WHERE Brand ="' + this.brand + '"';
      sql += ' AND FirstYear <= ' + this.year + ' AND (' + this.year + ' <= LastYear OR LastYear IS NULL)';

      console.log(sql);

      const response = await axios.get('http://localhost:3000/api/query/Rows?table=Model&sql=' + sql);
      const fuels = [];

      for (let row of response.data.rows)
        fuels.push({ value: row.Fuel, text: fuelTexts[row.Fuel] });

      this.fuels = fuels;
    },
    async fillModels() {
      let sql = 'SELECT DISTINCT Model FROM Model';
      sql += ' WHERE Brand ="' + this.brand + '"';
      sql += ' AND FirstYear <= ' + this.year + ' AND (' + this.year + ' <= LastYear OR LastYear IS NULL)';
      sql += ' AND Fuel = ' + this.fuel;
      
      console.log(sql);

      const response = await axios.get('http://localhost:3000/api/query/Rows?table=Model&sql=' + sql);
      const models = [];

      for (let row of response.data.rows)
        models.push(row.Model);

      this.models = models;
    },
    async fillEngineDisplacements() {
      let sql = 'SELECT DISTINCT EngineDisplacement FROM Model';
      sql += ' WHERE Brand ="' + this.brand + '"';
      sql += ' AND FirstYear <= ' + this.year + ' AND (' + this.year + ' <= LastYear OR LastYear IS NULL)';
      sql += ' AND Fuel = ' + this.fuel;
      sql += ' AND Model = "' + this.model + '"';

      console.log(sql);
      
      const response = await axios.get('http://localhost:3000/api/query/Rows?table=Model&sql=' + sql);
      const engineDisplacements = [];

      for (let row of response.data.rows)
        engineDisplacements.push(row.EngineDisplacement);

      this.engineDisplacements = engineDisplacements;
    },
    async searchByLicenseNumber() {
      const response = await axios.get('http://localhost:3000/api/table/Vehicle/row?LicenseNumber=' + this.licenseNumber);
      console.log(response.data);
    },
    clear() {
      this.brand = null;
      this.year = null;
      this.years = [];
      this.fuel = null;
      this.fuels = [];
      this.model = null;
      this.models = [];
      this.engineDisplacement = null;
      this.engineDisplacements = [];
    },
    post() {
    },
    clearLicenseNumber() {
      this.licenseNumber = '';
    }
  }
}
</script>
