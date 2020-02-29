<template>
  <div>
    <h1 v-if="showCaption">{{ caption }}</h1>
    <form @submit.prevent="post" @keydown.esc="cancel">
      <table>
        <tr v-for="(field, index) in fields" :key="index + 20">
          <td>
            <div v-if="field.showDialogCaption()">
              <span :class="{ missing: isMissing(field)}">{{ field.caption }}:</span>
              <span v-if="field.required && !field.isReadOnly" class="required-asterix"></span>
            </div>
          </td>
          <td>
            <div v-if="field.isReadOnly" :class="{ value: true, code: field.isCode }">{{ field.displayText(row) }}</div>
            <input v-else-if="field.dialogInputType() == 'text'" type="text" :ref="field.name" :autofocus="field.getAutoFocus()" v-model="row[field.name]" :size="field.getInputTextLength()">
            <textarea v-else-if="field.dialogInputType() == 'textarea'" :ref="field.name" :autofocus="field.getAutoFocus()" v-model="row[field.name]" :cols="field.getCols()" :rows="field.getRows()"></textarea>
            <select v-else-if="field.dialogInputType() == 'select'" :ref="field.name" :autofocus="field.getAutoFocus()" v-model="row[field.name]">
              <option v-for="option in field.lookupList" :key="option.value" :value="option.value">{{option.text}}</option>
            </select>
            <div v-else-if="field.dialogInputType() == 'checkbox'">
              <input type="checkbox" :ref="field.name" :autofocus="field.getAutoFocus()" v-model="row[field.name]">
              <span>{{ field.caption }}</span>
            </div>
          </td>
        </tr>
      </table>
      <div class="buttons">
        <button class="default" type="button" @click="post">OK</button>
        <button type="button" @click="cancel">Peru</button>
      </div>
      <div v-if="missingValues" class="info missing">Punaisella merkityt kentät puuttuvat</div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { EditState, EditedData, Field } from '../lib/dataset';

@Component
export default class TableDialog extends Vue {
  @Prop({ type: Object, required: true }) table: any;
  @Prop({ type: Number, required: true }) state: EditState;
  @Prop({ type: Boolean, default: true }) showCaption: boolean;
  @Prop({ type: Array }) query: any;

  private row: any = null;
  private savedRow: any =  null;
  private posted = false;
  private missingValues = false;

  get caption(): string {
    switch (this.state) {
      case EditState.ADD: return this.table.getAddCaption();
      case EditState.EDIT: return this.table.getEditCaption();
    }

    return '';
  }
  
  get fields(): any {
    if (this.row != null)
      return this.table.fieldsAsArray.filter(field => {
        return !field.hideInDialog && !(field.isReadOnly && field.isNull(this.row));
      });

    return [];
  }

  async mounted() {
    await this.table.findLookupLists();
    await this.getRow();

    const list = document.getElementsByTagName('input');

    if (list.length > 0) {
      list[0].focus();
    }
  }

  async getRow() {
    switch (this.state) {
      case EditState.ADD:
        this.row = this.table.newRow();
        this.savedRow = this.copyRow(this.row);
        break;

      case EditState.EDIT:
        this.row = await this.table.getRow(this.query);
        this.savedRow = this.copyRow(this.row);
        break;
    }
  }

  async post() {
    this.posted = true;
    this.missingValues = !this.validate();

    if (this.missingValues)
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
  }

  cancel() {
    this.$router.go(-1);
  }

  isMissing(field: Field) {
    return this.posted && !field.isValid(this.row);
  }

  validate() {
    for (const field of this.table.fieldsAsArray) {
      if (!field.isReadOnly && !field.isValid(this.row))
      {
        if (this.$refs[field.name]) {
          this.$refs[field.name][0].focus();
        }

        return false;
      }
    }

    return true;
  }

  copyRow(row: any) {
    const result: any = {};

    for (const key of Object.keys(row))
      result[key] = row[key];

    return result;
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

.info {
  margin-top: 10px;
}
</style>
