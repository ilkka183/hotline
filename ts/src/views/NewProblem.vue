<template>
  <main class="container">
    <h2>Lisää uusi vikatapaus</h2>
    <div class="mb-2">
      <b-button variant="primary" class="mr-2" @click="setMethod(0)">Hae rekisterinumerolla</b-button>
      <b-button variant="primary" class="mr-2" @click="setMethod(1)">Ohjattu syöttö</b-button>
      <b-button variant="primary" class="mr-2" @click="setMethod(2)">Manuaalinen syöttö</b-button>
      <b-button variant="secondary" class="mr-2" @click="back()">Peru</b-button>
    </div>

    <div v-if="method == 0 && !ready">
      <h3>Hae rekisterinumerolla</h3>
      <b-form inline>
        <b-input class="mr-2" type="text" v-model="licenseNumber" />
        <b-button variant="primary" class="mr-2" @click="findRegistrationNumber" :disabled="!licenseNumber">Hae</b-button>
        <b-button variant="primary" class="mr-2" @click="clearRegistrationNumber" :disabled="!licenseNumber">Tyhjennä</b-button>
        <b-button variant="light" class="mr-2" @click="setRegistrationNumber('ZLP-833')">Leon</b-button>
        <b-button variant="light" class="mr-2" @click="setRegistrationNumber('ISI-560')">Focus</b-button>
      </b-form>
    </div>

    <div v-if="method == 1 && !ready">
      <b-select class="mb-2" v-model="brand" :options="brands" @change="fillYears" />
      <b-select class="mb-2" v-model="year" :options="years" @change="fillFuels" v-if="brand !== null" />
      <b-select class="mb-2" v-model="fuel" :options="fuels" @change="fillModels" v-if="year !== null" />
      <b-select class="mb-2" v-model="model" :options="models" @change="fillEngineSizes" v-if="fuel !== null" />
      <b-select class="mb-2" v-model="engineSize" :options="engineSizes" v-if="model !== null" />
      <b-button variant="primary" class="mr-2" :disabled="engineSize === null" @click="postSelections">Jatka</b-button>
      <b-button variant="primary" class="mr-2" @click="clearSelections">Tyhjennä</b-button>
    </div>
    
    <TableDialog v-show="ready" ref="dialog" :table="table" :state="state" :showCaption="false" />
  </main>
</template>

<script  lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TableDialog from '@/components/TableDialog.vue';
import { BaseTable } from '../tables/base';
import { ProblemTable } from '../tables/problem';
import { EditState } from '../lib/dataset';
import { getTraficom } from '../services/traficomService';
import { getBrands, getYears, getFuels, getModels, getEngineSizes } from '../services/dataService';
import BaseVue from './BaseVue.vue';

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
export default class NewProblem extends BaseVue {
  private table: ProblemTable;
  private method: CreateMethod = null;
  private ready = false;

  public licenseNumber: string = null;

  private brand: string = null;
  private year: number = null;
  private fuel: number = null;
  private model: string = null;
  private engineSize: number = null;

  private brands = [];
  private years = [];
  private fuels = [];
  private models = [];
  private engineSizes = [];

  created() {
    this.table = new ProblemTable(this.database, this.user);
  }

  mounted() {
    this.licenseNumber = 'ZLP-833',

    this.clearSelections();
  }

  private get dialog(): any {
    return this.$refs.dialog;
  }

  private get row() {
    return this.dialog.row;
  }

  private get state(): EditState {
    return EditState.Add;
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
    getTraficom(this.licenseNumber)
      .then(response => {
        console.log(response.data);

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
    getBrands()
      .then(response => {
        const items = [];
        items.push({ value: null, text: 'Valitse merkki' });

        for (const item of response.data)
          items.push({ value: item, text: item });

        this.brands = items;
      });
  }

  private fillYears() {
    getYears(this.brand)
      .then(response => {
        const items = [];
        items.push({ value: null, text: 'Valitse vuosimalli' });

        for (const item of response.data)
          items.push({ value: item, text: item });

        this.years = items;
      });
  }

  private fillFuels() {
    getFuels(this.brand, this.year)
      .then(response => {
        const items = [];
        items.push({ value: null, text: 'Valitse käyttövoima' });

        for (const item of response.data)
          items.push({ value: item, text: BaseTable.FUELS[item] });

        this.fuels = items;
      });
  }

  private fillModels() {
    getModels(this.brand, this.year, this.fuel)
      .then(response => {
        const items = [];
        items.push({ value: null, text: 'Valitse malli' });

        for (const item of response.data)
          items.push({ value: item, text: item });

        this.models = items;
      });
  }

  private async fillEngineSizes() {
    getEngineSizes(this.brand, this.year, this.fuel, this.model)
      .then(response => {
        const items = [];
        items.push({ value: null, text: 'Valitse moottori' });

        for (const item of response.data)
          items.push({ value: item, text: item });

        this.engineSizes = items;
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
