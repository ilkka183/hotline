<template>
  <b-container>

    <h2>Vikatapaus</h2>

    <template v-if="row">
      <b-table-simple borderless small>
        <b-tbody>
          <tr><td>No:</td><td>{{ row.Id }}</td></tr>
          <tr><td>Pvm:</td><td>{{ row.Date }}</td></tr>
          <tr v-if="showSender(row.UserId)"><td>Lähettäjä:</td><td>{{ row.UserName }}</td></tr>
          <tr v-if="showLicenseNumber()"><td>Rekisterinumero:</td><td>{{ row.LicenseNumber }}</td></tr>
          <tr><td>Merkki:</td><td>{{ row.Brand }}</td></tr>
          <tr><td>Malli:</td><td>{{ row.Model }}</td></tr>
          <tr><td>Alkuvuosi:</td><td>{{ row.YearMin }}</td></tr>
          <tr><td>Loppuvuosi:</td><td>{{ row.YearMax }}</td></tr>
          <tr><td>Käyttövoima:</td><td>{{ fuelText }}</td></tr>
          <tr><td>Tila:</td><td :class="statusColor(row.Status)">{{ statusText }}</td></tr>
        </b-tbody>
      </b-table-simple>

      <h2 class="title">{{ row.Title }}</h2>
      <p class="decription">{{ row.Description }}</p>

      <b-button v-if="row.Status == 0" variant="primary" class="mb-2" size="sm" @click="addReply">Lisää uusi vastaus</b-button>

      <table class="table">
        <thead>
          <tr>
            <th>Pvm</th>
            <th>Lähettäjä</th>
            <th>Viesti</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reply in visibleReplies" v-bind:key="reply.id">
            <td>{{ formatDate(reply.Date) }}</td>
            <td><span v-if="showSender(reply.UserId)">{{ reply.UserName }}</span></td>
            <td>{{ reply.Message }}</td>
            <td><b-button v-if="(user.id == reply.UserId) && !reply.Solution" variant="primary" size="sm" @click="editReply(reply)">Muokkaa</b-button></td>
            <td><b-button v-if="(user.id == row.UserId)" variant="primary" size="sm" @click="setResolved(reply)">{{ resolveButtonText(reply) }}</b-button></td>
          </tr>
        </tbody>
      </table>

      <b-button v-if="user.id == row.UserId" variant="danger" class="mr-2" @click="deleteRow">Poista</b-button>
      <b-button v-if="user.id == row.UserId" variant="success" class="mr-2" @click="editRow">Muokkaa</b-button>
      <b-button variant="light" class="float-right ml-2" @click="close">Sulje</b-button>

      <b-alert variant="danger" class="mt-2" fade show v-if="errorMessage">
        <div>{{ errorMessage }}</div>
      </b-alert>

    </template>
  </b-container>
</template>

<script  lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import DatasetGrid from '../components/DatasetGrid.vue';
import { Field, DateField } from '../lib/dataset';
import { SqlTable } from '../lib/sql-dataset';
import { ProblemStatus, ProblemTable, ProblemReplyTable } from '../tables/problem';
import BaseVue from './BaseVue.vue';
import { UserRole } from '../js/user'

@Component({
  components: {
    DatasetGrid
  }
})
export default class OpenProblem extends BaseVue {
  private row: any | null = null;
  private replies: any[] = [];
  private errorMessage: string = null;

  async mounted() {
    const id = Number(this.$route.query.Id);

    const response = await this.axios.get('/custom/Problem?Id=' + id);
    const rows = response.data;

    if (rows.length > 0) {
      this.row = rows[0];

      const response = await this.axios.get('/custom/ProblemReplies?ProblemId=' + this.row.Id);
      this.replies = response.data.rows;
    }
  }

  private statusColor(status: ProblemStatus): string {
    switch (status) {
      case ProblemStatus.Open: return 'open';
      case ProblemStatus.Resolved: return 'resolved';
      case ProblemStatus.Unresolved: return 'unresolved';
     }

     return null;
  }

  private get visibleReplies(): any[] {
    if (this.row.Status == 1)
      return this.replies.filter(r => r.Solution);

    return this.replies;
  }

  private get fuelText(): string {
    return ProblemTable.fuelTexts[this.row.Fuel];
  }

  private get statusText(): string {
    return ProblemTable.statusTexts[this.row.Status];
  }

  private showSender(userId: number): boolean {
    return this.user ? this.user.showSender || this.user.id == userId : false;
  }

  private showLicenseNumber(): boolean {
    return this.user ? this.user.showLicenseNumber : false;
  }

  private editRow() {
    this.$router.push({ path: 'edit/Problem?Id=' + this.row.Id });
  }

  private addReply() {
    this.$router.push({ path: 'add/ProblemReply?ProblemId=' + this.row.Id });
  }

  private editReply(reply: any) {
    this.$router.push({ path: 'edit/ProblemReply?Id=' + reply.Id + '&ProblemId=' + reply.ProblemId });
  }

  private resolveButtonText(reply: any): string {
    return reply.Solution ? 'Poista ratkaisuna' : 'Aseta ratkaisuksi';
  }
  
  private async setResolved(reply: any) {
    if (confirm(reply.Solution ? 'Poista ratkaisuna?' : 'Merkitse ratkaisuksi?')) {
      const params = {
        Id: this.row.Id
      }

      const Status = reply.Solution ? ProblemStatus.Open : ProblemStatus.Resolved;
      await this.axios.put('/table/Problem', { Status }, { params });
      this.row.Status = Status;


      const replyParams = {
        Id: reply.Id,
        ProblemId: reply.ProblemId
      }

      const Solution = !reply.Solution;
      await this.axios.put('/table/ProblemReply', { Solution }, { params: replyParams });
      reply.Solution = Solution;
    }
  }

  private formatDate(date: any) {
    return DateField.format(date);
  }
  
  private sqlError(error) {
    this.errorMessage = error.response.data.sqlMessage;
  }

  private async deleteRow() {
    if (confirm('Poista vikatapaus?')) {
      try {
        const response = await this.axios.delete('/table/Problem?Id=' + this.row.Id);
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

<style scoped>
.open {
  color: red;
}

.resolved {
  color: green;
}

.unresolved {
  color: gray;
}
</style>

