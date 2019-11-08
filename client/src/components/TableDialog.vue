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
import { Data, EditState, EditedData } from '../lib/dataset.js';

export default {
  props: {
    table: { type: Object, required: true }
  },
  data() {
    return {
      row: null,
      savedRow: null,
      state: EditState.ADD,
    }
  },
  computed: {
    caption() {
      switch (this.state) {
        case EditState.ADD: return this.table.getAddCaption();
        case EditState.EDIT: return this.table.getEditCaption();
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
    if (Object.keys(this.$route.query).length > 0)
      this.state = EditState.EDIT;
    else
      this.state = EditState.ADD;
      
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
      switch (this.state) {
        case EditState.ADD:
          this.row = this.table.newRow();
          this.savedRow = this.copyRow(this.row);
          break;

        case EditState.EDIT:
          this.row = await this.table.getRow(this.$route.query);
          this.savedRow = this.copyRow(this.row);
          break;
      }
    },
    async post() {
      if (!this.validate())
        return;

      let row = null;

      switch (this.state) {
        case EditState.ADD:
          console.log(JSON.stringify(this.row));
          await this.table.addRow(this.row);
          row = this.row;
          break;

        case EditState.EDIT:
          console.log(JSON.stringify(this.savedRow));
          console.log(JSON.stringify(this.row));

          if (JSON.stringify(this.savedRow) !== JSON.stringify(this.row)) {
            await this.table.updateRow(this.savedRow, this.row);
          }

          row = this.savedRow;
          break;
      }

      this.table.database.editedData = new EditedData(this.table.name, row, this.state);
      this.$router.go(-1);
    },
    cancel() {
      this.$router.go(-1);
    },
    isMissing(field) {
      return this.posted && !field.isValid(this.row);
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
    copyRow(row) {
      const result = {};

      for (let key of Object.keys(row)) {
        const data = row[key];
        
        result[key] = new Data(data.value, data.displayText);
      }

      return result;
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