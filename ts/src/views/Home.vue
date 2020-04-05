<template>
  <div>
    <template v-if="user">
      <h2>Avoimet vikatapaukset</h2>
      <button @click="newProblem">Lisää uusi</button>
      <DatasetGrid :dataset="openProblems" :showNavigator="false" :showOpenButton="true" :showEditButton="false" :showDeleteButton="false" :showFooter="false"></DatasetGrid>
      <h2>Viimeksi ratkaistut vikatapaukset</h2>
      <DatasetGrid :dataset="closedProblems" :showNavigator="false" :showOpenButton="true" :showEditButton="false" :showDeleteButton="false" :showFooter="false"></DatasetGrid>
      <h2>Viimeisimmät tiedotteet</h2>
      <DatasetGrid :dataset="otherProblems" :showNavigator="false" :showOpenButton="true" :showEditButton="false" :showDeleteButton="false" :showFooter="false"></DatasetGrid>
      <h2>Ilmoitukset</h2>
      <DatasetGrid :dataset="notices" :showNavigator="false" :showOpenButton="true" :showEditButton="false" :showDeleteButton="false" :showFooter="false"></DatasetGrid>
    </template>
    <template v-else>
      <h2>Hotline</h2>
      <Login />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import DatasetGrid from '../components/DatasetGrid.vue';
import Base from '../components/Base.vue';
import Login from '../components/Login.vue';
import { NoticeTable } from '../tables/notice';
import { ProblemTable } from '../tables/problem';
import { RestDatabase } from '../lib/dataset';

@Component({
  components: {
    DatasetGrid,
    Login
  }
})
export default class Home extends Base {
  private openProblems: ProblemTable = new ProblemTable(this.database, { type: 0, status: 0 });
  private closedProblems: ProblemTable = new ProblemTable(this.database, { type: 0, status: 1 });
  private otherProblems: ProblemTable = new ProblemTable(this.database, { type: 1 });
  private notices: NoticeTable = new NoticeTable(this.database);

  get database(): RestDatabase {
    return this.$store.state.database;
  }

  private newProblem() {
    this.$router.push('new-problem');
  }
}
</script>
