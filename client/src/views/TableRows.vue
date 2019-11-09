<template>
  <DatasetGrid :dataset="table"></DatasetGrid>
</template>

<script>
import DatasetGrid from '../components/DatasetGrid';

export default {
  components: {
    DatasetGrid
  },
  props: {
    table: { type: Object, required: true }
  },
}
</script>

<style>
</style>
