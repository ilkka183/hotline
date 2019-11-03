<template>
  <div>
    <TableDialog v-if="isDialog" :table="this" :row="currentRow"></TableDialog>
    <TableGrid v-else :table="this"></TableGrid>
  </div>
</template>

<script>
import TableDialog from './TableDialog';
import TableGrid from './TableGrid';
import { Data } from '../lib/dataset.js';

export const TableState = {
  LIST: 0,
  ADD: 1,
  EDIT: 2,
  DELETE: 3
}

export default {
  components: {
    TableDialog,
    TableGrid
  },
  props: {
    dataset: { type: Object, required: true }
  },
  data() {
    return {
      pageNumber: 1,
      rowCount: 0,
      rows: [],
      savedRow: null,
      currentRow: null,
      editedRow: null,
      editedState: null,
      state: TableState.LIST,
    }
  },
  computed: {
    pageCount() {
      return Math.ceil(this.rowCount/this.dataset.pageLimit);
    },
    isDialog() {
      return this.state != TableState.LIST;
    },
    isAdding() {
      return this.state == TableState.ADD;
    },
    isEditing() {
      return this.state == TableState.EDIT;
    },
  },
  mounted() {
    this.getRows();
  },
  updated() {
    if (this.isDialog) {
      const list = document.getElementsByTagName('input');

      if (list.length > 0) {
        list[0].focus();
      }
    }
  },
  methods: {
    async getRows() {
      const data = await this.dataset.getRows(this.pageNumber);
      this.rowCount = data.rowCount;
      this.rows = data.rows;
    },
    async updateRow(oldRow, newRow) {
      await this.dataset.updateRow(oldRow, newRow);
      this.getRows();
      this.editedRow = newRow;
      this.editedState = TableState.EDIT;
    },
    async addRow(row) {
      const id = await this.dataset.addRow(row);
      this.editedRow = row;
      this.editedState = TableState.ADD;
      this.seekToPageBy(id);
    },
    async deleteRow(row) {
      if (confirm(`${this.dataset.getDeleteCaption()} (${this.dataset.contentOf(row)})?`)) {
        await this.dataset.deleteRow(row);
        this.getRows();
        this.editedRow = null;
        this.editedState = TableState.DELETE;
      }
    },
    startState(state, savedRow, currentRow) {
      this.state = state;
      this.savedRow = savedRow;
      this.currentRow = currentRow;
      this.editedRow = null;
    },
    startAdd() {
      this.startState(
        TableState.ADD,
        null,
        this.dataset.newRow());
    },
    copyRow(row) {
      const result = {};

      for (let key of Object.keys(row)) {
        const data = row[key];
        
        result[key] = new Data(data.value, data.displayText);
      }

      return result;
    },
    startEdit(row) {
      this.startState(
        TableState.EDIT,
        this.copyRow(row),
        this.copyRow(row));
    },
    async postEdit() {
      switch (this.state) {
        case TableState.ADD:
          console.log(JSON.stringify(this.currentRow));

          this.addRow(this.currentRow);
          break;

        case TableState.EDIT:
          console.log(JSON.stringify(this.savedRow));
          console.log(JSON.stringify(this.currentRow));

          if (JSON.stringify(this.savedRow) !== JSON.stringify(this.currentRow)) {
            this.updateRow(this.savedRow, this.currentRow);
          }

          break;
      }

      this.row = Object.assign({}, this.currentRow);
      this.state = TableState.LIST;
    },
    cancelEdit() {
      this.state = TableState.LIST;
    },
    refresh() {
      this.editedRow = null;
      this.editedState = TableState.LIST;
      this.getRows();
    },
    setPageNumber(value) {
      this.pageNumber = value;
      this.getRows();
    },
    firstPage() {
      this.setPageNumber(1);
    },
    prevPage() {
      if (this.pageNumber > 0)
        this.setPageNumber(this.pageNumber - 1);
    },
    nextPage() {
      if (this.pageNumber < this.pageCount)
        this.setPageNumber(this.pageNumber + 1);
    },
    lastPage() {
      this.setPageNumber(this.pageCount);
    },
    async seekToPageBy(id) {
      if (this.dataset.primaryKeyField != null) {
        this.pageNumber = 1;

        do {
          let data = await this.dataset.getRows(this.pageNumber);

          for (let row of data.rows) {
            if (row[this.dataset.primaryKeyField.name].value == id) {
              this.rows = data.rows;
              return;
            }
          }

          this.pageNumber++;
        } while (this.pageNumber <= this.pageCount);
      } else {
        this.firstPage();
      }
    }
  }
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