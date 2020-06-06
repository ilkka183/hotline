<template>
  <div>
    <DatasetGrid
      v-if="table"
      :title="title"
      :dataset="table"
      :showAddButton="showAddButton"
      :showSearch="true"
      :showOpenButtons="true"
      :showEditButtons="false"
      :showFooter="false"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import BaseVue from '../views/BaseVue.vue';
import DatasetGrid from '../components/DatasetGrid.vue';
import { ProblemTable, ProblemStatus } from '../tables/problem';

@Component({
  components: {
    DatasetGrid
  }
})
export default class ProblemGrid extends BaseVue {
  @Prop({ type: String, required: true }) readonly title: string;
  @Prop({ type: Number, required: true }) readonly status: ProblemStatus;
  @Prop({ type: Boolean, default: true }) readonly showAddButton: boolean;

  private table: ProblemTable = null;

  mounted() {
    this.table = new ProblemTable(this.database, this.user, { status: this.status });
  }
}
</script>

<style scoped>
</style>
