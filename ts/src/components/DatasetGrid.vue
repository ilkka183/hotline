<template>
  <div>
    <div v-if="showNavigator" class="navigator buttons">
      <button @click="addRow">Lisää uusi</button>
      <button @click="refreshRows">Päivitä</button>
      <template v-if="pageCount > 1">
        <button :disabled="pageNumber == 1" @click="firstPage">Ensimmäinen</button>
        <button :disabled="pageNumber == 1" @click="prevPage">Edellinen</button>
        <button v-for="number in pageCount" :key="number" :disabled="pageNumber == number" @click="setPageNumber(number)">{{number}}</button>
        <button :disabled="pageNumber == pageCount" @click="nextPage">Seuraava</button>
        <button :disabled="pageNumber == pageCount" @click="lastPage">Viimeinen</button>
        <span class="number">sivu {{ pageNumber }}/{{ pageCount }}</span>
      </template>
    </div>
    <table class="grid">
      <thead>
        <tr>
          <th class="data" v-for="(field, index) in fields" :key="index">{{field.caption}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" v-bind:key="row.id">
          <td class="data" v-for="(field, index) in fields" :key="index" :class="cellClasses(row, field)">
            <span :class="cellClass(field)" :style="cellStyle(field, row)">{{cellText(field, row)}}</span>
          </td>
          <td v-if="showOpenButton" class="action"><button @click="openRow(row)">Avaa</button></td>
          <td v-if="showEditButton" class="action"><button @click="editRow(row)">Muokkaa</button></td>
          <td v-if="showDeleteButton" class="action"><button @click="confirmDeleteRow(row)">Poista</button></td>
          <td class="added-text" v-if="hasRowAdded(row)">lisätty viimeksi</td>
          <td class="edited-text" v-else-if="hasRowEdited(row)">muokattu viimeksi</td>
        </tr>
      </tbody>
      <tfoot>
        <tr v-if="showFooter">
          <td class="data" :colspan="fields.length">{{rowCount}} riviä</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Dataset, EditState, EditedData, Field } from '../lib/dataset';
import { SqlTable } from '../lib/sql-dataset';

@Component
export default class DatasetGrid extends Vue {
  @Prop({ type: Object, required: true }) readonly dataset: SqlTable;
  @Prop({ type: Boolean, default: true }) readonly showNavigator: boolean;
  @Prop({ type: Boolean, default: false }) readonly showOpenButton: boolean;
  @Prop({ type: Boolean, default: true }) readonly showEditButton: boolean;
  @Prop({ type: Boolean, default: true }) readonly showDeleteButton: boolean;
  @Prop({ type: Boolean, default: true }) readonly showFooter: boolean;

  private pageNumber = 1;
  private rowCount = 0;
  private rows: object[] = [];

  get pageCount(): number {
    return Math.ceil(this.rowCount/this.dataset.pageLimit);
  }

  get fields(): Field[] {
    return this.dataset.fieldsAsArray.filter(field => !field.hideInGrid);
  }

  get editedData(): EditedData | null {
    return this.dataset.database.editedData;
  }

  mounted() {
    this.getRows();
  }

  private async getRows() {
    const data = await this.dataset.getRows(this.pageNumber);
    this.rowCount = data.rowCount;
    this.rows = data.rows;

    console.log(data.rows);
  }

  private refreshRows() {
    this.getRows();
  }

  private addRow() {
    this.dataset.navigateAdd(this.$router);
  }

  private openRow(row: object) {
    this.dataset.navigateOpen(this.$router, row);
  }

  private editRow(row: object) {
    this.dataset.navigateEdit(this.$router, row);
  }

  private async deleteRow(row: object) {
    await this.dataset.deleteRow(row);
    this.getRows();
    this.dataset.database.editedData = new EditedData(this.dataset.tableName, row, EditState.Delete);
  }

  private confirmDeleteRow(row: object) {
    if (this.dataset.confirmDeleteRow(row)) {
      this.deleteRow(row);
    }
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

  private hasRowState(row: object, state: EditState) {
    return (this.editedData != null) &&
      (this.editedData.table == this.dataset.tableName) &&
      (this.editedData.state == state) &&
      this.dataset.primaryKeysEquals(this.editedData.row, row);
  }

  private hasRowAdded(row: object) {
    return this.hasRowState(row, EditState.Add);
  }

  private hasRowEdited(row: object) {
    return this.hasRowState(row, EditState.Edit);
  }

  private hasFieldEdited(row: object, field: Field) {
    return this.hasRowEdited(row) && (this.editedData.row[field.name] != row[field.name]);
  }

  private setPageNumber(value: number) {
    this.pageNumber = value;
    this.getRows();
  }

  private firstPage() {
    this.setPageNumber(1);
  }

  private prevPage() {
    if (this.pageNumber > 0)
      this.setPageNumber(this.pageNumber - 1);
  }

  private nextPage() {
    if (this.pageNumber < this.pageCount)
      this.setPageNumber(this.pageNumber + 1);
  }

  private lastPage() {
    this.setPageNumber(this.pageCount);
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
      this.firstPage();
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

.undefined {
  color: red;
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
