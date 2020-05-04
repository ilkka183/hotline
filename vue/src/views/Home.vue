<template>
  <div>
    <b-container v-if="$store.state.token == null">
      <Login @login="createTables" />
    </b-container>
    <b-container fluid v-else>
      <DatasetGrid
        title="Avoimet vikatapaukset"
        :dataset="openProblems"
        :showAddButton="true"
        :showSearch="true"
        :showOpenButton="true"
        :showEditButton="false"
        :showDeleteButton="false"
        :showFooter="false"
      />
      <DatasetGrid
        title="Viimeksi ratkaistut vikatapaukset"
        :dataset="closedProblems"
        :showAddButton="false"
        :showSearch="true"
        :showOpenButton="true"
        :showEditButton="false"
        :showDeleteButton="false"
        :showFooter="false"
      />
      <DatasetGrid
        title="Ilmoitukset"
        :dataset="notices"
        :showAddButton="true"
        :showSearch="true"
        :showOpenButton="true"
        :showEditButton="false"
        :showDeleteButton="false"
        :showFooter="false"
      /> 
    </b-container>
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
    this.createTables();
  }

  private createTables() {
    this.openProblems = new ProblemTable(this.database, this.user, { status: 0 });
    this.closedProblems = new ProblemTable(this.database, this.user, { status: 1 });
    this.notices = new NoticeTable(this.database, this.user);
  }
}
</script>
