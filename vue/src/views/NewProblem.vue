<template>
  <main class="container">
    <h2>Lisää uusi vikatapaus</h2>

    <b-card class="mb-4" no-body>
      <b-tabs pills card @activate-tab="tabSelected">
        <b-tab title="Hae rekisterinumerolla" active>
          <b-row class="mb-2">
            <b-col>
              <b-input class="mr-2" type="text" v-model="licenseNumber" />
            </b-col>
            <b-col cols="8">
              <b-button variant="primary" class="mr-2" @click="findRegistrationNumber" :disabled="!licenseNumber">Hae</b-button>
              <b-button variant="primary" class="mr-2" @click="clearRegistrationNumber" :disabled="!licenseNumber">Tyhjennä</b-button>
              <b-button variant="light" class="mr-2" @click="setRegistrationNumber('ISI-560')">Focus</b-button>
              <b-button variant="light" class="mr-2" @click="setRegistrationNumber('ISI-650')">Golf</b-button>
              <b-button variant="light" class="mr-2" @click="setRegistrationNumber('ZLP-833')">Leon</b-button>
            </b-col>
          </b-row>
          <b-alert variant="danger" fade show v-if="errorMessage">{{ errorMessage }}</b-alert>
        </b-tab>
        <b-tab title="Ohjattu syöttö">
          <b-select class="mb-2" v-model="brand" :options="brands" @change="brandSelected" />
          <b-select class="mb-2" v-model="year" :options="years" @change="yearSelected" v-if="brand !== null" />
          <b-select class="mb-2" v-model="fuel" :options="fuels" @change="fuelSelected" v-if="year !== null" />
          <b-select class="mb-2" v-model="model" :options="models" @change="modelSelected" v-if="fuel !== null" />
          <b-select class="mb-2" v-model="engineSize" :options="engineSizes" v-if="model !== null" />
          <b-button variant="primary" class="mr-2" :disabled="engineSize === null" @click="postSelections">Jatka</b-button>
          <b-button variant="primary" class="mr-2" @click="clearSelections">Tyhjennä</b-button>
        </b-tab>
        <b-tab title="Manuaalinen syöttö">
        </b-tab>
      </b-tabs>
    </b-card>

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
  private errorMessage: string = null;

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

    this.fillBrands();
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

  private tabSelected(newTabIndex: number) {
    this.ready = newTabIndex === 2;
    this.clearSelections();
  }

  private apply(includeRegistrationNumber: boolean) {
    this.ready = true;

    this.row.UserId = 1;

    if (includeRegistrationNumber)
      this.row.LicenseNumber = this.licenseNumber;

    this.row.Brand = this.brand;
    this.row.Model = this.model;
    this.row.ModelYear = this.year;
    this.row.Fuel = this.fuel;
    this.row.EngineSize = this.engineSize;
    this.row.Status = 0;
  }


  //
  // By license number
  //

  private findRegistrationNumber() {
    this.errorMessage = null;

    getTraficom(this.licenseNumber)
      .then(response => {
        this.brand = response.data.carMake;
        this.model = response.data.carModel;
        this.year = response.data.registrationYear;
        this.fuel = 0;

        switch (response.data.fuelType) {
          case 'diesel':
            this.fuel = 1;
            break;
        }

        this.engineSize = response.data.engineSize;
        this.apply(true);
      })
      .catch(error => {
        this.errorMessage = 'Rekisterinumerolla ei löydy ajoneuvoa!';
      });
}

  private clearRegistrationNumber() {
    this.licenseNumber = null;
    this.errorMessage = null;
    this.ready = false;
  }

  private setRegistrationNumber(value: string) {
    this.licenseNumber = value;
  }


  //
  // By selections
  //

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

  private brandSelected() {
    getYears(this.brand)
      .then(response => {
        this.year = null;
        this.fuel = null;
        this.model = null;
        this.engineSize = null;

        const items = [];
        items.push({ value: null, text: 'Valitse vuosimalli' });

        for (const item of response.data)
          items.push({ value: item, text: item });

        this.years = items;
      });
  }

  private yearSelected() {
    getFuels(this.brand, this.year)
      .then(response => {
        this.fuel = null;
        this.model = null;
        this.engineSize = null;

        const items = [];
        items.push({ value: null, text: 'Valitse käyttövoima' });

        for (const item of response.data)
          items.push({ value: item, text: BaseTable.FUELS[item] });

        this.fuels = items;
      });
  }

  private fuelSelected() {
    getModels(this.brand, this.year, this.fuel)
      .then(response => {
        this.model = null;
        this.engineSize = null;

        const items = [];
        items.push({ value: null, text: 'Valitse malli' });

        for (const item of response.data)
          items.push({ value: item, text: item });

        this.models = items;
      });
  }

  private async modelSelected() {
    getEngineSizes(this.brand, this.year, this.fuel, this.model)
      .then(response => {
        this.engineSize = null;

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
