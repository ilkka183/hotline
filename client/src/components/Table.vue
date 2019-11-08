<template>
  <div>
    <TableDialog v-if="isDialog" :table="this" :row="currentRow"></TableDialog>
    <TableGrid v-else :table="this"></TableGrid>
  </div>
</template>

<script>
import TableDialog from './TableDialog';
import TableGrid from './TableGrid';

export default {
  components: {
    TableDialog,
    TableGrid
  },
  props: {
    dataset: { type: Object, required: true }
  },
}
</script>

<style scoped>
.value {
  font-size: 14px;
}

button.default {
  font-weight: bold;
}
</style>