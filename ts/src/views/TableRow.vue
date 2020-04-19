<template>
  <b-container>
    <TableDialog :table="table" :state="state" :query="query"></TableDialog>
  </b-container>
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

  private state: EditState = EditState.Open;

  mounted() {
    switch (this.$route.params.state) {
      case "add":
        this.state = EditState.Add;
        this.table.fixedValues = this.$route.query;
        break;

      case "edit":
        this.state = EditState.Edit;
        break;

      case "open":
        this.state = EditState.Open;
        break;
    }
  }

  get query() {
    return this.$route.query;
  }
}
</script>

<style>
</style>
