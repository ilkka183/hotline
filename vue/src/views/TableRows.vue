<template>
  <b-container fluid>
    <DatasetGrid :dataset="table" :title="caption" :showSearch="false"></DatasetGrid>
  </b-container>
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
