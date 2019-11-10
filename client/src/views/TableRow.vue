<template>
  <TableDialog :table="table"></TableDialog>
</template>

<script>
import TableDialog from '@/components/TableDialog';

export default {
  components: {
    TableDialog
  },
  props: {
    table: { type: Object, required: true }
  },
}
</script>

<style>
</style>
