<template>
  <Table :dataset="table"></Table>
</template>

<script>
import BaseView from './BaseView';
import Table from '../components/Table';
import { BrandTable } from '../lib/tables';

export default {
  extends: BaseView,
  components: {
    Table
  },
  data() {
    return {
      table: new BrandTable(this.database),
    }
  }
}
</script>

<style>
</style>
