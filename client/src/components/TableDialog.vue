<template>
  <div>
    <h1>{{caption}}</h1>
    <form @submit.prevent="post" @keydown.esc="cancel">
      <table>
        <tr v-for="(field, index) in fields" v-bind:key="index">
          <td> <!-- caption -->
            <div v-if="field.showDialogCaption()">
              <span :class="{ missing: isMissing(field)}">{{field.caption}}:</span>
              <span v-if="field.required && !field.isReadOnly" class="required-asterix"></span>
            </div>
          </td>
          <td> <!-- control -->
            <div v-if="field.isReadOnly" :class="{ value: true, code: field.isCode }">{{field.displayText(row)}}</div>
            <input v-else-if="field.dialogInputType() == 'text'" :ref="field.name" :autofocus="field.getAutoFocus()" v-model="row[field.name].value" type="text" :size="field.getInputTextLength()">
            <textarea v-else-if="field.dialogInputType() == 'textarea'" :ref="field.name" :autofocus="field.getAutoFocus()" v-model="row[field.name].value" :cols="field.getCols()" :rows="field.getRows()"></textarea>
            <select v-else-if="field.dialogInputType() == 'select'" :ref="field.name" :autofocus="field.getAutoFocus()" v-model="row[field.name].value">
              <option v-for="option in field.lookupList" :key="option.value" :value="option.value">{{option.text}}</option>
            </select>
            <div v-else-if="field.dialogInputType() == 'checkbox'">
              <input type="checkbox" :ref="field.name" :autofocus="field.getAutoFocus()" v-model="row[field.name].value">
              <span>{{field.caption}}</span>
            </div>
          </td>
        </tr>
      </table>
      <div class="buttons">
        <button class="default" type="button" @click="post">OK</button>
        <button type="button" @click="cancel">Peru</button>
      </div>
    </form>
  </div>
</template>

<script>
import { Data } from '../lib/dataset.js';

export const TableState = {
  ADD: 0,
  EDIT: 1,
  DELETE: 2
}

export default {
  props: {
    table: { type: Object, required: true }
  },
  data() {
    return {
      row: null,
      posted: false,
      savedRow: null,
      currentRow: null,
      editedRow: null,
      editedState: null,
      state: TableState.LIST,
    }
  },
  computed: {
    isAdding() {
      return this.state == TableState.ADD;
    },
    isEditing() {
      return this.state == TableState.EDIT;
    },
    caption() {
      if (this.isAdding) {
        return this.table.getAddCaption();
      } else if (this.isEditing) {
        return this.table.getEditCaption();
      }

      return '';
    },
    fields() {
      if (this.row != null)
        return this.table.fields.filter(field => field.isVisibleInDialog(this.row));

      return [];
    },
  },
  mounted() {
    this.getRow();

    for (let field of this.fields)
      if (!field.isReadOnly)
        field.findLookupList();

    this.posted = false;
  },
  updated() {
    const list = document.getElementsByTagName('input');

    if (list.length > 0) {
      list[0].focus();
    }
  },
  methods: {
    async getRow() {
      this.row = await this.table.getRow(this.$route.query);
    },
    async addRow(row) {
      const id = await this.table.addRow(row);
      this.editedRow = row;
      this.editedState = TableState.ADD;
      this.seekToPageBy(id);
    },
    async updateRow(oldRow, newRow) {
      await this.table.updateRow(oldRow, newRow);
      this.getRows();
      this.editedRow = newRow;
      this.editedState = TableState.EDIT;
    },
    isMissing(field) {
      return this.posted && !field.isValid(this.row);
    },
    post() {
      this.$router.go(-1);
/*      this.posted = true;

      if (!this.validate())
        return;

      this.table.postEdit(); */
    },
    cancel() {
      this.$router.go(-1);
//      this.table.cancelEdit();
    },
    validate() {
      for (let field of this.table.fields) {
        if (!field.isReadOnly && !field.isValid(this.row))
        {
          if (this.$refs[field.name])
            this.$refs[field.name][0].focus();

          return false;
        }
      }

      return true;
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
        this.table.newRow());
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
  }
}
</script>

<style scoped>
.code {
  font-family: 'Courier New', Courier, monospace;
}

.missing {
  color: red;
}

.required-asterix {
  color: red;
  margin-left: 2px;
  margin-right: 2px;
  font-weight: bold;
}

.required-asterix:after {
  content: "*";
}

.buttons {
  margin-bottom: 5px;
}

.buttons button {
  margin-right: 5px;
}
</style>