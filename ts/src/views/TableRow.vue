<template>
  <TableDialog :table="table" :state="state" :query="query"></TableDialog>
</template>

<script>
import TableDialog from '@/components/TableDialog';
import { EditState } from '@/lib/dataset';

export default {
  components: {
    TableDialog
  },
  props: {
    table: { type: Object, required: true }
  },
  computed: {
    query() {
      return this.$route.query;
    },
    state() {
      if (Object.keys(this.query).length > 0)
        return EditState.EDIT;
      else
        return EditState.ADD;
    }
  }
}
</script>

<style>
</style>
