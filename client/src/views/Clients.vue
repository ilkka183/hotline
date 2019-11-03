<template>
  <Table :dataset="table"></Table>
</template>

<script>
import BaseView from './BaseView';
import Table from '../components/Table';
import { ClientTable } from '../lib/tables';

export default {
  extends: BaseView,
  components: {
    Table
  },
  data() {
    return {
      table: new ClientTable(this.database),
    }
  }
}
</script>

<style>
</style>
