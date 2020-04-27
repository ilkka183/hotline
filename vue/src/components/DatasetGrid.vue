<template>
  <div>
    <h2>{{ title }}</h2>
    <b-navbar class="m-1" v-if="showNavigator">
      <b-button variant="primary" class="mr-2" size="sm" v-if="showAddButton" @click="addRow">Lisää uusi</b-button>
      <b-nav-form v-if="showSearch" @submit.stop.prevent>
        <b-form-input size="sm" class="mr-2" v-model="searchText" @keydown.enter="search" />
        <b-button variant="primary" size="sm" class="mr-2" @click="search">Hae</b-button>
        <b-button variant="primary" size="sm" class="mr-2" @click="clearSearchText" :disabled="!searchText">Kaikki</b-button>
      </b-nav-form>
      <b-pagination
        class="m-0 mr-2"
        v-if="pageCount > 1"
        v-model="pageNumber"
        :total-rows="rowCount"
        :per-page="dataset.rowsPerPage"
        @change="pageChanged"
      />
      <b-nav-text :colspan="fields.length">{{rowCount}} riviä</b-nav-text>
    </b-navbar>
    <table class="table">
      <thead>
        <tr>
          <th class="data" v-for="(field, index) in fields" :key="index">{{field.caption}}</th>
          <th v-if="showOpenButton"></th>
          <th v-if="showEditButton"></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" v-bind:key="row.id">
          <td class="data" v-for="(field, index) in fields" :key="index" :class="cellClasses(row, field)">
            <span :class="cellClass(field)" :style="cellStyle(field, row)">{{cellText(field, row)}}</span>
          </td>
          <td v-if="showOpenButton"><b-button variant="primary" size="sm" @click="openRow(row)">Avaa</b-button></td>
          <td v-if="showEditButton"><b-button variant="primary" size="sm" @click="editRow(row)">Muokkaa</b-button></td>
          <td class="added-text" v-if="hasRowAdded(row)">lisätty</td>
          <td class="edited-text" v-else-if="hasRowEdited(row)">muokattu</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Dataset, EditedData, Field } from '../lib/dataset';
import { SqlTable } from '../lib/sql-dataset';

@Component
export default class DatasetGrid extends Vue {
  @Prop({ type: String, required: true }) readonly title: string;
  @Prop({ type: Object, required: true }) readonly dataset: SqlTable;
  @Prop({ type: Boolean, default: true }) readonly showNavigator: boolean;
  @Prop({ type: Boolean, default: true }) readonly showAddButton: boolean;
  @Prop({ type: Boolean, default: false }) readonly showSearch: boolean;
  @Prop({ type: Boolean, default: false }) readonly showOpenButton: boolean;
  @Prop({ type: Boolean, default: true }) readonly showEditButton: boolean;
  @Prop({ type: Boolean, default: true }) readonly showFooter: boolean;

  private pageNumber = 1;
  private rowCount = 0;
  private rows: object[] = [];
  private searchText = '';

  get pageCount(): number {
    return Math.ceil(this.rowCount/this.dataset.rowsPerPage);
  }

  get fields(): Field[] {
    return this.dataset.fieldsAsArray.filter(field => !field.hideInGrid);
  }

  get savedData(): EditedData | null {
    return this.dataset.database.savedData;
  }

  get editedData(): EditedData | null {
    return this.dataset.database.editedData;
  }

  get addedData(): EditedData | null {
    return this.dataset.database.addedData;
  }

  mounted() {
    if (this.dataset.database.pageNumber != null) {
      this.pageNumber = this.dataset.database.pageNumber
      this.dataset.database.pageNumber = null;
    }

    this.getRows();
  }

  private async getRows() {
    const data = await this.dataset.getRows(this.pageNumber, this.searchText);
    this.rowCount = data.rowCount;
    this.rows = data.rows;

    console.log(data.rows);
  }

  private refreshRows() {
    this.getRows();
  }

  private search() {
    this.getRows();
  }

  private clearSearchText() {
    this.searchText = '';
    this.getRows();
  }

  private addRow() {
    this.dataset.database.startEditRow(this.pageNumber, null);
    this.dataset.navigateAdd(this.$router);
  }

  private editRow(row: object) {
    this.dataset.database.startEditRow(this.pageNumber, new EditedData(this.dataset.tableName, Dataset.copyRow(row)));
    this.dataset.navigateEdit(this.$router, row);
  }

  private openRow(row: object) {
    this.dataset.navigateOpen(this.$router, row);
  }

  private cellClass(field: Field) {
    return {
        code: field.isCode
      };
  }

  private cellStyle(field: Field, row: object) {
    const style = {};

    const color = field.cellColor(row);

    if (color)
      style['color'] = color;

    return style;
  }

  private cellText(field: Field, row: object) {
    const value = row[field.name];

    if (value !== undefined)
      return field.displayText(row);

    return 'undefined';
  }

  private cellClasses(row: object, field: Field) {
    return {
      added: this.hasRowAdded(row),
      edited: this.hasFieldEdited(row, field),
      undefined: row[field.name] === undefined,
      alignRight: field.alignRight,
      alignCenter: field.alignCenter
    }
  }

  private hasRowAdded(row: object) {
    return this.addedData && (this.addedData.table == this.dataset.tableName) && this.dataset.primaryKeysEquals(this.addedData.row, row);
  }

  private hasRowEdited(row: object) {
    return this.editedData && (this.editedData.table == this.dataset.tableName) && this.dataset.primaryKeysEquals(this.editedData.row, row);
  }

  private hasFieldEdited(row: object, field: Field) {
    return this.hasRowEdited(row) && this.savedData && (this.savedData.row[field.name] != row[field.name]);
  }

  private setPageNumber(value: number) {
    this.pageNumber = value;
    this.getRows();
  }

  private pageChanged(page) {
    this.setPageNumber(page);
  }

  private async seekToPageBy(id: any) {
    if (this.dataset.primaryKeyField != null) {
      this.pageNumber = 1;

      do {
        const data = await this.dataset.getRows(this.pageNumber);

        for (const row of data.rows) {
          if (row[this.dataset.primaryKeyField.name] == id) {
            this.rows = data.rows;
            return;
          }
        }

        this.pageNumber++;
      } while (this.pageNumber <= this.pageCount);
    } else {
      this.setPageNumber(0);
    }
  }
}
</script>

<style scoped>
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

.undefined {
  color: red;
}

.selected {
  font-weight: bold;
  text-decoration: underline;
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
