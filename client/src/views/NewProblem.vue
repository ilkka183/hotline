<template>
  <div>
    <h1>Lisää uusi vikatapaus</h1>
    <div class="buttons">
      <button @click="setMethod(0)">Hae rekisterinumerolla</button>
      <button @click="setMethod(1)">Ohjattu syöttö</button>
      <button @click="setMethod(2)">Manuaalinen syöttö</button>
    </div>
    <div v-if="method == 0 && !ready">
      <table>
        <tr>
          <td>
            <label for="licenseNumber">Rekisterinumero:</label>
          </td>
          <td>
            <input id="licenseNumber" type="text" v-model="selections.licenseNumber">
          </td>
          <td>
            <div class="buttons">
              <button @click="searchByLicenseNumber" :disabled="!selections.licenseNumber">Hae</button>
              <button @click="clearLicenseNumber" :disabled="!selections.licenseNumber">Tyhjennä</button>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div v-if="method == 1 && !ready">
      <table>
        <tr>
          <td><label for="brand">Merkki:</label></td>
          <td>
            <select id="brand" v-model="selections.brand" @change="fillYears">
              <option :value="null">-</option>
              <option v-for="brand in selections.brands" :key="brand">{{brand}}</option>
            </select>
          </td>
        </tr>
        <tr v-if="selections.brand !== null">
          <td><label for="modelYear">Vuosimalli:</label></td>
          <td>
            <select id="modelYear" v-model="selections.year" @change="fillFuels">
              <option :value="null">-</option>
              <option v-for="year in selections.years" :key="year">{{year}}</option>
            </select>
          </td>
        </tr>
        <tr v-if="selections.year != null">
          <td><label for="fuel">Käyttövoima:</label></td>
          <td>
            <select id="fuel" v-model="selections.fuel" @change="fillModels">
              <option :value="null">-</option>
              <option v-for="fuel in selections.fuels" :key="fuel.value" :value="fuel.value">{{fuel.text}}</option>
            </select>
          </td>
        </tr>
        <tr v-if="selections.fuel !== null">
          <td><label for="model">Malli:</label></td>
          <td>
            <select id="model" v-model="selections.model" @change="fillEngineDisplacements">
              <option :value="null">-</option>
              <option v-for="model in selections.models" :key="model">{{model}}</option>
            </select>
          </td>
        </tr>
        <tr v-if="selections.model !== null">
          <td><label for="engineDisplacement">Iskutilavuus:</label></td>
          <td>
            <select id="engineDisplacement" v-model="selections.engineDisplacement">
              <option :value="null">-</option>
              <option v-for="engineDisplacement in selections.engineDisplacements" :key="engineDisplacement">{{engineDisplacement}}</option>
            </select>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <div class="buttons">
              <button :disabled="selections.engineDisplacement === null" @click="postSelections">Jatka</button>
              <button @click="clearSelections">Tyhjennä</button>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div v-if="method == 2">
    </div>
    <TableDialog v-show="ready" ref="dialog" :table="table" :state="state" :showCaption="false" />
  </div>
</template>

<script>
import { EditState } from '@/lib/dataset';
import TableDialog from '@/components/TableDialog';
import { ProblemTable } from '@/tables/problem';
import Selections from '@/js/selections';

/*
  - Liite
  - a) tietokantaan
  - b) suomaan käyttäjälle sähköpotina
  -   *** 1) anonyymi 2) yrityksen nimellä
  - palkitaan paras vastaus, valitaan yksi vastaus
  - luokitus vastaajilta
*/

export default {
  components: {
    TableDialog
  },
  props: {
    connection: { type: Object, required: true }
  },
  data() {
    return {
      table: new ProblemTable(this.connection.database),
      ready: false,
      method: null,
      selections: new Selections(),
    }
  },
  computed: {
    state() {
      return EditState.ADD;
    },
    row() {
      return this.$refs.dialog.row;
    }
  },
  methods: {
    async setMethod(value) {
      this.method = value;

      switch (value) {
        case 0:
          this.ready = false;
          break;

        case 1:
          this.ready = false;
          this.selections.clear();
          await this.selections.fillBrands();
          break;

        case 2:
          console.log('manual');
          this.ready = true;
          break;
      }
    },
    apply(includeLicenseNumber) {
      this.ready = true;

      console.log(this.selections);

      this.row.ClientId = 1;
      this.row.Type = 0;

      if (includeLicenseNumber)
        this.row.LicenseNumber = this.selections.licenseNumber;

      this.row.Brand = this.selections.brand;
      this.row.Model = this.selections.model;
      this.row.ModelYear = this.selections.year;
      this.row.Fuel = this.selections.fuel;
      this.row.EngineDisplacement = this.selections.engineDisplacement;
      this.row.Status = 0;
    },
    async searchByLicenseNumber() {
      if (await this.selections.findByLicenseNumber())
        this.apply(true);
    },
    postSelections() {
      this.apply(false);
    },
    clearLicenseNumber() {
      this.selections.licenseNumber = null;
    },
    clearSelections() {
      this.selections.clear();
    },
    fillYears() {
      this.selections.fillYears();
    },
    fillFuels() {
      this.selections.fillFuels();
    },
    fillModels() {
      this.selections.fillModels();
    },
    fillEngineDisplacements() {
      this.selections.fillEngineDisplacements();
    }
  }
}
</script>

<style scoped>
</style>
