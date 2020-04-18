<template>
  <div>
    <main class="container" v-if="$store.state.token == null">
      <Login />
    </main>
    <main class="container-fluid" v-else>
      <h2>Avoimet vikatapaukset</h2>
      <button class="btn btn-primary mb-2" @click="newProblem">Lisää uusi</button>
      <DatasetGrid :dataset="openProblems" :showNavigator="false" :showOpenButton="true" :showEditButton="false" :showDeleteButton="false" :showFooter="false"></DatasetGrid>
      <h2>Viimeksi ratkaistut vikatapaukset</h2>
      <DatasetGrid :dataset="closedProblems" :showNavigator="false" :showOpenButton="true" :showEditButton="false" :showDeleteButton="false" :showFooter="false"></DatasetGrid>
      <h2>Ilmoitukset</h2>
      <DatasetGrid :dataset="notices" :showNavigator="false" :showOpenButton="true" :showEditButton="false" :showDeleteButton="false" :showFooter="false"></DatasetGrid> 
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import DatasetGrid from '../components/DatasetGrid.vue';
import Login from '../components/Login.vue';
import { NoticeTable } from '../tables/notice';
import { ProblemTable } from '../tables/problem';
import { RestDatabase } from '../lib/dataset';
import BaseVue from './BaseVue.vue';

@Component({
  components: {
    DatasetGrid,
    Login
  }
})
export default class Home extends BaseVue {
  private openProblems: ProblemTable;
  private closedProblems: ProblemTable;
  private notices: NoticeTable;

  created() {
    this.openProblems = new ProblemTable(this.database, this.user, { status: 0 });
    this.closedProblems = new ProblemTable(this.database, this.user, { status: 1 });
    this.notices = new NoticeTable(this.database, this.user);
  }

  private newProblem() {
    this.$router.push('new-problem');
  }
}
</script>
