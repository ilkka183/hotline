<template>
  <main class="container-fluid">
    <h2>{{ caption }}</h2>
    <DatasetGrid :dataset="table"></DatasetGrid>
  </main>
</template>

<script  lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import DatasetGrid from '@/components/DatasetGrid.vue';
import { SqlTable } from '../lib/sql-dataset';

@Component({
  components: {
    DatasetGrid
  }
})
export default class TableRows extends Vue {
  @Prop({ type: Object, required: true }) readonly table: SqlTable; 

  get caption(): string {
    return this.table.listCaption;
  }
}
</script>

<style>
</style>
