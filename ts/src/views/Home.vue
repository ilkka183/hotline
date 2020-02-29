<template>
  <div>
    <template v-if="$store.state.user">
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
    </template>
  </div>
</template>

<script>
import DatasetGrid from '@/components/DatasetGrid';
import { NoticeTable } from '@/tables/notice';
import { ProblemTable } from '@/tables/problem';

export default {
  components: {
    DatasetGrid
  },
  props: {
    connection: { type: Object, required: true }
  },
  data() {
    return {
      openProblems: new ProblemTable(this.connection.database, { type: 0, status: 0 }),
      closedProblems: new ProblemTable(this.connection.database, { type: 0, status: 1 }),
      otherProblems: new ProblemTable(this.connection.database, { type: 1 }),
      notices: new NoticeTable(this.connection.database),
    }
  },
  methods: {
    newProblem() {
      this.$router.push('new-problem');
    }
  }
}
</script>
