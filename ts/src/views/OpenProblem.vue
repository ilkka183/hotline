<template>
  <div>
    <h2>Vikatapaus</h2>
    <div class="buttons">
      <button @click="editRow">Muokkaa</button>
      <button @click="deleteRow">Poista</button>
    </div>
    <template v-if="row">
      <table>
        <tr><td>No:</td><td>{{ row.Id }}</td></tr>
        <tr><td>Pvm:</td><td>{{ table.fields.Date.displayText(row) }}</td></tr>
        <tr><td>Lähettäjä:</td><td>{{ table.fields.UserId.displayText(row) }}</td></tr>
        <tr><td>Tyyppi:</td><td>{{ table.fields.Type.displayText(row) }}</td></tr>
        <tr><td>Rekisterinumero:</td><td>{{ table.fields.LicenseNumber.displayText(row) }}</td></tr>
        <tr><td>Merkki:</td><td>{{ row.Brand }}</td></tr>
        <tr><td>Malli:</td><td>{{ row.Model }}</td></tr>
        <tr><td>Vuosimalli:</td><td>{{ table.fields.ModelYear.displayText(row) }}</td></tr>
        <tr><td>Käyttövoima:</td><td>{{ table.fields.Fuel.displayText(row) }}</td></tr>
        <tr><td>Tila:</td><td>{{ table.fields.Status.displayText(row) }}</td></tr>
      </table>
      <h2 class="title">{{ row.Title }}</h2>
      <p class="decription">{{ row.Description }}</p>
    </template>
    <div class="buttons">
      <button class="default" @click="close">Sulje</button>
    </div>
  </div>
</template>

<script  lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { SqlTable } from '../lib/sql-dataset';
import { ProblemTable } from '../tables/problem';

@Component
export default class OpenProblem extends Vue {
  private table: any = new ProblemTable(this.database);
  private row: object | null = null;

  private get database() {
    return this.$store.state.database;
  }

  async mounted() {
    await this.table.findLookupLists();
    this.row = await this.table.getRow(this.$route.query);
  }

  private editRow() {
    const query = this.table.primaryKeys(this.row);
    this.$router.push({ path: this.table.tableName, query });
  }

  private async deleteRow() {
    if (this.table.confirmDeleteRow(this.row)) {
      await this.table.deleteRow(this.row);
      this.close();
    }
  }

  private close() {
    this.$router.go(-1);
  }
}
</script>
