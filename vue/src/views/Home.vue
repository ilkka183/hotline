<template>
  <div>
    <b-container fluid v-if="user">
      <DatasetGrid
        v-if="openProblems"
        title="Avoimet vikatapaukset"
        :dataset="openProblems"
        :showAddButton="true"
        :showSearch="true"
        :showOpenButtons="true"
        :showEditButtons="false"
        :showFooter="false"
      />
      <DatasetGrid
        v-if="closedProblems"
        title="Viimeksi ratkaistut vikatapaukset"
        :dataset="closedProblems"
        :showAddButton="false"
        :showSearch="true"
        :showOpenButtons="true"
        :showEditButtons="false"
        :showFooter="false"
      />
      <DatasetGrid
        v-if="notices"
        title="Ilmoitukset"
        :dataset="notices"
        :showAddButton="true"
        :showSearch="true"
        :showOpenButtons="true"
        :showEditButtons="false"
        :showFooter="false"
      /> 
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import DatasetGrid from '../components/DatasetGrid.vue';
import { NoticeTable } from '../tables/notice';
import { ProblemTable } from '../tables/problem';
import { RestDatabase } from '../lib/dataset';
import BaseVue from './BaseVue.vue';

@Component({
  components: {
    DatasetGrid
  }
})
export default class Home extends BaseVue {
  private openProblems: ProblemTable = null;
  private closedProblems: ProblemTable = null;
  private notices: NoticeTable = null;

  mounted() {
    const token = localStorage.getItem('token');

    if (token) {
      this.$store.dispatch('login', token);

      this.openProblems = new ProblemTable(this.database, this.user, { status: 0 });
      this.closedProblems = new ProblemTable(this.database, this.user, { status: 1 });
      this.notices = new NoticeTable(this.database, this.user);
    }
  }
}
</script>
