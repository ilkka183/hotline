<template>
  <main class="container">
    <TableDialog :table="table" :state="state" :query="query"></TableDialog>
  </main>
</template>

<script  lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TableDialog from '@/components/TableDialog.vue';
import { EditState } from '../lib/dataset';
import { SqlTable } from '../lib/sql-dataset';

@Component({
  components: {
    TableDialog
  }
})
export default class TableRow extends Vue {
  @Prop({ type: Object, required: true }) readonly table: SqlTable;

  get query() {
    return this.$route.query;
  }

  get state(): EditState {
    if (Object.keys(this.query).length > 0)
      return EditState.Edit;
    else
      return EditState.Add;
  }
}
</script>

<style>
</style>
