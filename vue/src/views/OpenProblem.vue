<template>
  <b-container>

    <h2>Vikatapaus</h2>

    <template v-if="row">
      <b-table-simple borderless small>
        <b-tbody>
          <tr><td>No:</td><td>{{ row.Id }}</td></tr>
          <tr><td>Pvm:</td><td>{{ table.fields.Date.displayText(row) }}</td></tr>
          <tr v-if="user.showSender"><td>Lähettäjä:</td><td>{{ table.fields.UserId.displayText(row) }}</td></tr>
          <tr v-if="user.showLicenseNumber"><td>Rekisterinumero:</td><td>{{ table.fields.LicenseNumber.displayText(row) }}</td></tr>
          <tr><td>Merkki:</td><td>{{ row.Brand }}</td></tr>
          <tr><td>Malli:</td><td>{{ row.Model }}</td></tr>
          <tr><td>Alkuvuosi:</td><td>{{ table.fields.YearMin.displayText(row) }}</td></tr>
          <tr><td>Loppuvuosi:</td><td>{{ table.fields.YearMax.displayText(row) }}</td></tr>
          <tr><td>Käyttövoima:</td><td>{{ table.fields.Fuel.displayText(row) }}</td></tr>
          <tr><td>Tila:</td><td>{{ table.fields.Status.displayText(row) }}</td></tr>
        </b-tbody>
      </b-table-simple>

      <h2 class="title">{{ row.Title }}</h2>
      <p class="decription">{{ row.Description }}</p>

      <DatasetGrid title="Vastaukset" :dataset="replies" :showFooter="false" :showPagination="false"></DatasetGrid>
    </template>

    <b-button variant="danger" class="mr-2" @click="deleteRow">Poista</b-button>
    <b-button variant="success" class="mr-2" @click="editRow">Muokkaa</b-button>
    <b-button variant="light" class="float-right ml-2" @click="close">Sulje</b-button>

    <b-alert variant="danger" class="mt-2" fade show v-if="errorMessage">
      <div>{{ errorMessage }}</div>
    </b-alert>
  </b-container>
</template>

<script  lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import DatasetGrid from '../components/DatasetGrid.vue';
import { Field } from '../lib/dataset';
import { SqlTable } from '../lib/sql-dataset';
import { ProblemTable, ProblemReplyTable } from '../tables/problem';
import BaseVue from './BaseVue.vue';
import { UserRole } from '../js/user'

@Component({
  components: {
    DatasetGrid
  }
})
export default class OpenProblem extends BaseVue {
  private table: any;
  private replies: ProblemReplyTable;
  private row: object | null = null;
  private errorMessage: string = null;

  created() {
    this.table = new ProblemTable(this.database, this.user);
  }

  async mounted() {
    const id = Number(this.$route.query.Id);

    await this.table.fetchLookups();
    this.row = await this.table.getRow(this.$route.query);
    this.replies = new ProblemReplyTable(this.database, this.user, id);
  }

  private get showSender(): boolean {
    return this.user ? this.user.showSender : false;
  }

  private get showLicenseNumber(): boolean {
    return this.user ? this.user.showLicenseNumber : false;
  }

  private get fields(): Field[] {
    return this.replies.fieldsAsArray.filter(field => !field.hideInGrid);
  }

  private editRow() {
    const query = this.table.primaryKeys(this.row);
    this.$router.push({ path: 'edit/' + this.table.tableName, query });
  }

  private sqlError(error) {
    this.errorMessage = error.response.data.sqlMessage;
  }

  private async deleteRow() {
    if (this.table.confirmDeleteRow(this.row)) {
      try {
        await this.table.deleteRow(this.row);
        this.close();
      }
      catch (e) {
        this.sqlError(e);
      }
    }
  }

  private close() {
    this.$router.go(-1);
  }
}
</script>
