<template>
  <div>
    <h1>Vikatapaus</h1>
    <button @click="editRow">Muokkaa</button>
    <button @click="deleteRow">Poista</button>
    <table v-if="row">
      <tr><td>No:</td><td>{{row.Id}}</td></tr>
      <tr><td>Pvm:</td><td>{{row.Date}}</td></tr>
      <tr><td>Lähettäjä:</td><td>{{row.ClientId}}</td></tr>
      <tr><td>Tyyppi:</td><td>{{row.Type}}</td></tr>
      <tr><td>Rekisterinumero:</td><td>{{row.LicenseNumber}}</td></tr>
      <tr><td>Merkki:</td><td>{{row.Brand}}</td></tr>
      <tr><td>Malli:</td><td>{{row.Model}}</td></tr>
      <tr><td>Vuosimalli:</td><td>{{row.ModelYear}}</td></tr>
      <tr><td>Käyttövoima:</td><td>{{row.Fuel}}</td></tr>
      <tr><td>Otsikko:</td><td>{{row.Title}}</td></tr>
      <tr><td>Kuvaus:</td><td>{{row.Description}}</td></tr>
      <tr><td>Tila:</td><td>{{row.Status}}</td></tr>
    </table>
    <button @click="close">Sulje</button>
  </div>
</template>

<script>
import { ProblemTable } from '@/tables/problem';

export default {
  components: {
  },
  props: {
    database: { type: Object, required: true }
  },
  data() {
    return {
      table: new ProblemTable(this.database),
      row: null,
    }
  },
  async mounted() {
    this.row = await this.table.getRow(this.$route.query);
  },
  methods: {
    editRow() {
    },
    deleteRow() {
    },
    close() {
      this.$router.go(-1);
    }
  }
}
</script>
