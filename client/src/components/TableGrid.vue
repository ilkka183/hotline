<template>
  <div>
    <h1>{{caption}}</h1>
    <div class="navigator">
      <button @click="addRow">Lisää uusi</button>
      <button @click="refreshRows">Päivitä</button>
      <template v-if="pageCount > 1">
        <button :disabled="pageNumber == 1" @click="firstPage">Ensimmäinen</button>
        <button :disabled="pageNumber == 1" @click="prevPage">Edellinen</button>
        <button v-for="number in pageCount" :key="number" :disabled="pageNumber == number" @click="setPageNumber(number)">{{number}}</button>
        <button :disabled="pageNumber == pageCount" @click="nextPage">Seuraava</button>
        <button :disabled="pageNumber == pageCount" @click="lastPage">Viimeinen</button>
        <span class="number">sivu {{pageNumber}}/{{pageCount}}</span>
      </template>
    </div>
    <table class="grid">
      <tr>
        <th class="data" v-for="(field, index) in fields" :key="index">{{field.caption}}</th>
      </tr>
      <tr v-for="row in rows" v-bind:key="row.id">
        <td class="data" v-for="(field, index) in fields" :key="index" :class="cellClasses(row, field)">
          <span :class="{ code: field.isCode }">{{field.displayText(row)}}</span>
        </td>
        <td class="action"><button @click="editRow(row)">Muokkaa</button></td>
        <td class="action"><button @click="confirmDeleteRow(row)">Poista</button></td>
        <td class="added-text" v-if="hasRowAdded(row)">lisätty</td>
        <td class="edited-text" v-else-if="hasRowEdited(row)">muokattu</td>
      </tr>
      <tr>
        <td class="data" :colspan="fields.length">{{rowCount}} riviä</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { EditState, EditedData } from '../lib/dataset.js';

export default {
  props: {
    dataset: { type: Object, required: true }
  },
  data() {
    return {
      pageNumber: 1,
      rowCount: 0,
      rows: [],
    }
  },
  computed: {
    caption() {
      return this.dataset.getListCaption();
    },
    pageCount() {
      return Math.ceil(this.rowCount/this.dataset.pageLimit);
    },
    fields() {
      return this.dataset.fields.filter(field => !field.hideInGrid);
    },
    editedData() {
      return this.dataset.database.editedData;
    },
  },
  mounted() {
    this.getRows();
  },
  methods: {
    async getRows() {
      const data = await this.dataset.getRows(this.pageNumber);
      this.rowCount = data.rowCount;
      this.rows = data.rows;
    },
    refreshRows() {
      this.getRows();
    },
    addRow() {
      this.$router.push(this.dataset.tableName);
    },
    editRow(row) {
      const query = {};

      for (let field of this.dataset.fields)
        if (field.isPrimaryKey)
          query[field.name] = row[field.name].value;

      this.$router.push({ path: this.dataset.tableName, query });
    },
    async deleteRow(row) {
      await this.dataset.deleteRow(row);
      this.getRows();
      this.dataset.database.edited = new EditedData(this.dataset.tableName, row, EditState.DELETE);
    },
    confirmDeleteRow(row) {
      if (confirm(`${this.dataset.getDeleteCaption()} (${this.dataset.contentCaptionOf(row)})?`)) {
        this.deleteRow(row);
      }
    },
    cellClasses(row, field) {
      return {
        added: this.hasRowAdded(row),
        edited: this.hasFieldEdited(row, field),
        alignRight: field.alignRight,
        alignCenter: field.alignCenter
      }
    },
    hasRowState(row, state) {
      return (this.editedData != null) &&
        (this.editedData.table == this.dataset.tableName) &&
        (this.editedData.state == state) &&
        this.dataset.primaryKeysEquals(this.editedData.row, row);
    },
    hasRowAdded(row) {
      return this.hasRowState(row, EditState.ADD);
    },
    hasRowEdited(row) {
      return this.hasRowState(row, EditState.EDIT);
    },
    hasFieldEdited(row, field) {
      return this.hasRowEdited(row) && (this.editedData.row[field.name].value != row[field.name].value);
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
button:disabled {
/*  background-color: transparent;
  border-color: transparent; */
}

.navigator button {
  margin-right: 4px
}

.number {
  padding-left: 5px;
  padding-right: 5px;
}

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