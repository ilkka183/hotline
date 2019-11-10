<template>
  <div>
    <h1>{{caption}}</h1>
    <DatasetGrid :dataset="table"></DatasetGrid>
  </div>
</template>

<script>
import DatasetGrid from '@/components/DatasetGrid';

export default {
  components: {
    DatasetGrid
  },
  props: {
    table: { type: Object, required: true }
  },
  computed: {
    caption() {
      return this.table.getListCaption();
    },
  }
}
</script>

<style>
</style>
