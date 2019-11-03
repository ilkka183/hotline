<template>
  <Table :dataset="table"></Table>
</template>

<script>
import BaseView from './BaseView';
import Table from '../components/Table';
import { ClientGroupTable } from '../lib/tables';

export default {
  extends: BaseView,
  components: {
    Table
  },
  data() {
    return {
      table: new ClientGroupTable(this.database),
    }
  }
}
</script>

<style>
</style>
