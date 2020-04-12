<template>
  <div>
    <h2>Lisää uusi vikatapaus</h2>
    <div class="buttons methods">
      <button @click="setMethod(0)">Hae rekisterinumerolla</button>
      <button @click="setMethod(1)">Ohjattu syöttö</button>
      <button @click="setMethod(2)">Manuaalinen syöttö</button>
      <button @click="back()">Peru</button>
    </div>
    <div v-if="method == 0 && !ready">
      <table>
        <tr>
          <td>
            <label for="licenseNumber">Rekisterinumero:</label>
            <input id="licenseNumber" type="text" v-model="licenseNumber">
          </td>
          <td>
            <button @click="findRegistrationNumber" :disabled="!licenseNumber">Hae</button>
          </td>
          <td>
            <button @click="clearRegistrationNumber" :disabled="!licenseNumber">Tyhjennä</button>
          </td>
          <td>
            <button @click="setRegistrationNumber('ZLP-833')">Leon</button>
          </td>
          <td>
            <button @click="setRegistrationNumber('ISI-560')">Focus</button>
          </td>
        </tr>
      </table>
    </div>
    <div v-if="method == 1 && !ready">
      <table>
        <tr>
          <td><label for="brand">Merkki:</label></td>
          <td>
            <select id="brand" v-model="brand" @change="fillYears">
              <option :value="null">-</option>
              <option v-for="brand in brands" :key="brand">{{ brand }}</option>
            </select>
          </td>
        </tr>
        <tr v-if="brand !== null">
          <td><label for="modelYear">Vuosimalli:</label></td>
          <td>
            <select id="modelYear" v-model="year" @change="fillFuels">
              <option :value="null">-</option>
              <option v-for="year in years" :key="year">{{ year }}</option>
            </select>
          </td>
        </tr>
        <tr v-if="year != null">
          <td><label for="fuel">Käyttövoima:</label></td>
          <td>
            <select id="fuel" v-model="fuel" @change="fillModels">
              <option :value="null">-</option>
              <option v-for="fuel in fuels" :key="fuel.value" :value="fuel.value">{{ fuel.text }}</option>
            </select>
          </td>
        </tr>
        <tr v-if="fuel !== null">
          <td><label for="model">Malli:</label></td>
          <td>
            <select id="model" v-model="model" @change="fillEngineSizes">
              <option :value="null">-</option>
              <option v-for="model in models" :key="model">{{ model }}</option>
            </select>
          </td>
        </tr>
        <tr v-if="model !== null">
          <td><label for="engineSize">Iskutilavuus:</label></td>
          <td>
            <select id="engineSize" v-model="engineSize">
              <option :value="null">-</option>
              <option v-for="engineSize in engineSizes" :key="engineSize">{{ engineSize }}</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>
            <button :disabled="engineSize === null" @click="postSelections">Jatka</button>
            <button @click="clearSelections">Tyhjennä</button>
          </td>
        </tr>
      </table>
    </div>
    <div v-if="method == 2">
    </div>
    <TableDialog v-show="ready" ref="dialog" :table="table" :state="state" :showCaption="false" />
  </div>
</template>

<script  lang="ts">
import axios from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';
import TableDialog from '@/components/TableDialog.vue';
import { BaseTable } from '../tables/base';
import { ProblemTable } from '../tables/problem';
import { EditState } from '../lib/dataset';

/*
  - Liite
  - a) tietokantaan
  - b) suomaan käyttäjälle sähköpotina
  -   *** 1) anonyymi 2) yrityksen nimellä
  - palkitaan paras vastaus, valitaan yksi vastaus
  - luokitus vastaajilta
*/

enum CreateMethod {
  RegistrationNumber = 0,
  Selections,
  Manual
}

@Component({
  components: {
    TableDialog
  }
})
export default class NewProblem extends Vue {
  private readonly table: ProblemTable = new ProblemTable(this.database);
  private method: CreateMethod = null;
  private ready = false;

  public licenseNumber = '';

  private brand: string = null;
  private year: number = null;
  private fuel: number = null;
  private model: string = null;
  private engineSize: number = null;

  private brands: string[] = [];
  private years: number[] = [];
  private fuels: object[] = [];
  private models: string[] = [];
  private engineSizes: number[] = [];

  private get dialog(): any {
    return this.$refs.dialog;
  }

  get row() {
    return this.dialog.row;
  }

  private get database() {
    return this.$store.state.database;
  }

  get state(): EditState {
    return EditState.Add;
  }

  protected mounted() {
    this.licenseNumber = 'ZLP-833',

    this.clearSelections();
  }

  private setMethod(value: number) {
    if (this.method != value) {
      this.method = value;

      switch (value) {
        case CreateMethod.RegistrationNumber:
          this.ready = false;
          break;

        case CreateMethod.Selections:
          this.ready = false;
          this.clearSelections();
          this.fillBrands();
          break;

        case CreateMethod.Manual:
          this.apply(true);
          break;
      }
    }
  }

  private apply(includeRegistrationNumber: boolean) {
    this.ready = true;

    this.row.UserId = 1;
    this.row.Type = 0;

//    if (includeRegistrationNumber)
//      this.row.LicenseNumber = this.licenseNumber;

    this.row.Brand = this.brand;
    this.row.Model = this.model;
    this.row.ModelYear = this.year;
    this.row.Fuel = this.fuel;
    this.row.EngineSize = this.engineSize;
    this.row.Status = 0;
  }

  // 0) Registration number
  private findRegistrationNumber() {
    axios.get('http://localhost:3000/api/traficom/' + this.licenseNumber)
      .then(response => {
        this.brand = response.data.carMake;
        this.model = response.data.carModel;
        this.year = response.data.registrationYear;

        switch (response.data.fuelType) {
          case 'bensiini':
            this.fuel = 0;
            break;
        }

        this.engineSize = response.data.engineSize;
        this.apply(true);
      });
  }

  private clearRegistrationNumber() {
    this.licenseNumber = null;
  }

  private setRegistrationNumber(value: string) {
    this.licenseNumber = value;
  }

  // 1) selections
  private postSelections() {
    this.apply(false);
  }

  private clearSelections() {
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

  private fillBrands() {
    const url = 'http://localhost:3000/api/data/brands';
    
    axios.get(url)
      .then(response => {
        const brands: string[] = [];

        for (const brand of response.data)
          brands.push(brand);

        this.brands = brands;
      });
  }

  private fillYears() {
    const url = 'http://localhost:3000/api/data/years?brand=' + this.brand;

    axios.get(url)
      .then(response => {
        const years: number[] = [];

        for (const year of response.data)
          years.push(year);

        this.years = years;
      });
  }

  private fillFuels() {
    const url = 'http://localhost:3000/api/data/fuels?brand=' + this.brand + '&year=' + this.year;

    axios.get(url)
      .then(response => {
        const fuels: object[] = [];

        for (const fuel of response.data)
          fuels.push({ value: fuel, text: BaseTable.FUELS[fuel] });

        this.fuels = fuels;
      });
  }

  private fillModels() {
    const url = 'http://localhost:3000/api/data/models?brand=' + this.brand + '&year=' + this.year + '&fuel=' + this.fuel;

    axios.get(url)
      .then(response => {
        const models: string[] = [];

        for (const model of response.data)
          models.push(model);

        this.models = models;
      });
  }

  private async fillEngineSizes() {
    const url = 'http://localhost:3000/api/data/engineSizes?brand=' + this.brand + '&year=' + this.year + '&fuel=' + this.fuel + '&model=' + this.model;

    axios.get(url)
      .then(response => {
        const engineSizes: number[] = [];

        for (const engineSize of response.data)
          engineSizes.push(engineSize);

        this.engineSizes = engineSizes;
      });
  }

  private back() {
    this.$router.go(-1);
  }
}
</script>

<style scoped>
.methods {
  margin-bottom: 10px;
}
</style>
