<template>
  <TableGrid :dataset="table"></TableGrid>
</template>

<script>
import TableGrid from '../components/TableGrid';

export default {
  components: {
    TableGrid
  },
  props: {
    table: { type: Object, required: true }
  },
}
</script>

<style>
</style>
