<template>
  <div>
    <h1>{{caption}}</h1>
    <TableNavigator :table="table"></TableNavigator>
    <table class="grid">
      <tr>
        <th class="data" v-for="(field, index) in fields" :key="index">{{field.caption}}</th>
      </tr>
      <tr v-for="row in table.rows" v-bind:key="row.id">
        <td class="data" v-for="(field, index) in fields" :key="index" :class="cellClasses(row, field)">
          <span :class="{ code: field.isCode() }">{{field.displayText(row)}}</span>
        </td>
        <td class="action"><button @click="table.startEdit(row)">Muokkaa</button></td>
        <td class="action"><button @click="table.deleteRow(row)">Poista</button></td>
        <td class="added-text" v-if="hasRowAdded(row)">lisätty</td>
        <td class="edited-text" v-else-if="hasRowEdited(row)">muokattu</td>
      </tr>
      <tr>
        <td class="data" :colspan="fields.length">{{table.rowCount}} riviä</td>
      </tr>
    </table>
  </div>
</template>

<script>
import TableComponent from './TableComponent';
import TableNavigator from './TableNavigator';
import { TableState } from './Table';

export default {
  extends: TableComponent,
  components: {
    TableNavigator
  },
  computed: {
    caption() {
      return this.dataset.getListCaption();
    },
    fields() {
      return this.dataset.fields.filter(field => !field.hideInGrid);
    },
    savedRow() {
      return this.table.savedRow;
    },
    editedRow() {
      return this.table.editedRow;
    },
    editedState() {
      return this.table.editedState;
    },
  },
  methods: {
    cellClasses(row, field) {
      return {
        added: this.hasRowAdded(row),
        edited: this.hasFieldEdited(row, field),
        alignRight: field.alignRight,
        alignCenter: field.alignCenter
      }
    },
    hasRowAdded(row) {
      return (this.editedRow != null) && this.dataset.primaryKeysEquals(this.editedRow, row) && (this.editedState == TableState.ADD);
    },
    hasRowEdited(row) {
      return (this.editedRow != null) && this.dataset.primaryKeysEquals(this.editedRow, row) && (this.editedState == TableState.EDIT);
    },
    hasFieldEdited(row, field) {
      return this.hasRowEdited(row) && (this.savedRow[field.name].value !== this.editedRow[field.name].value);
    },
  }
}
</script>

<style scoped>
.code {
  font-family: 'Courier New', Courier, monospace;
}

.alignRight {
  text-align: right;
}

.alignCenter {
  text-align: center;
}

.grid {
  margin-top: 5px;
  margin-bottom: 5px;
}

th.data {
  background-color: #E0E0E0;
}
      
th.data, td.data {
  border: 1px solid #C0C0C0;
  vertical-align: top;
  padding: 4px;
}

td.action {
  background-color: white;
}

.grid tr:nth-child(even) {
  background-color: #F6F6F6;
}

.added {
  background-color: #e6ffe6;
}

.added-text {
  color: #008000;
  background-color: white;
}

.edited {
  background-color: #fff6e6;
}

.edited-text {
  color: #ffa500;
  background-color: white;
}

.deleted {
  background-color: #ffe6e6;
}

.deleted-text {
  color: #ff0000;
  background-color: white;
}
</style>