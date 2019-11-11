<template>
  <TableDialog :table="table" :state="state"></TableDialog>
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
    state() {
      if (Object.keys(this.$route.query).length > 0)
        return EditState.EDIT;
      else
        return EditState.ADD;
    }
  }
}
</script>

<style>
</style>
