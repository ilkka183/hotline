<template>
  <div>
    <h2 v-if="showCaption">{{ caption }}</h2>
    <form class="form" @submit.prevent="post" @keydown.esc="cancel">
      <div class="form-group row mb-2" v-for="(field, index) in fields" :key="index + 20">
        <div class="col-sm-2 col-form-label col-form-label-sm">
          <div v-if="field.showDialogCaption()">
            <span :class="{ missing: isMissing(field)}">{{ field.caption }}:</span>
            <span v-if="field.isRequired && !field.isReadOnly" class="required-asterix"></span>
          </div>
        </div>
        <div class="col-sm-10">
          <input class="form-control form-control-sm shadow-none" v-if="field.isReadOnly" :class="{ value: true, code: field.isCode }" :value="field.displayText(row)" readonly>
          <input class="form-control form-control-sm" v-else-if="field.dialogInputType() == 'text'" type="text" :ref="field.name" :autofocus="field.getAutoFocus()" v-model="row[field.name]">
          <textarea class="form-control" v-else-if="field.dialogInputType() == 'textarea'" :ref="field.name" :autofocus="field.getAutoFocus()" v-model="row[field.name]" :rows="field.getRows()"></textarea>
          <b-form-select class="form-control" v-else-if="field.dialogInputType() == 'select'" :ref="field.name" :autofocus="field.getAutoFocus()" :options="field.lookup.options" v-model="row[field.name]" />
          <div class="form-check" v-else-if="field.dialogInputType() == 'checkbox'">
            <input class="form-check-input" type="checkbox" :ref="field.name" :id="field.name" :autofocus="field.getAutoFocus()" v-model="row[field.name]">
            <label class="form-check-label" for="field.name">{{ field.caption }}</label>
          </div>
        </div>
      </div>
      <div class="mb-3">
        <b-button variant="primary" class="mr-2" @click="post">OK</b-button>
        <b-button variant="light" class="mr-2" @click="cancel">Peru</b-button>
        <b-button variant="danger" class="float-right" v-if="isEditing" @click="confirmDelete">Poista</b-button>
      </div>
      <b-alert variant="danger" fade show v-if="missingValues">
        <div>Punaisella merkityt kentät puuttuvat!</div>
      </b-alert>
      <b-alert variant="danger" fade show v-if="errorMessage">
        <div>{{ errorMessage }}</div>
      </b-alert>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Dataset, EditState, EditedData, Field } from '../lib/dataset';
import { SqlTable } from '../lib/sql-dataset';

@Component
export default class TableDialog extends Vue {
  @Prop({ type: Object, required: true }) readonly table: SqlTable;
  @Prop({ type: Number, required: true }) readonly state: EditState;
  @Prop({ type: Boolean, default: true }) readonly showCaption: boolean;
  @Prop({ type: Object }) readonly query: any;

  public row: object = null;
  private savedRow: object =  null;
  private posted = false;
  private missingValues = false;
  private errorMessage = '';

  get caption(): string {
    switch (this.state) {
      case EditState.Add: return this.table.addCaption;
      case EditState.Edit: return this.table.editCaption;
    }

    return '';
  }

  get isAdding(): boolean {
    return this.state == EditState.Add;
  }
  
  get isEditing(): boolean {
    return this.state == EditState.Edit;
  }
  
  get fields(): Field[] {
    if (this.row != null)
      return this.table.fieldsAsArray.filter(field => {
        return !field.hideInDialog && !(field.isReadOnly && field.isNull(this.row));
      });

    return [];
  }

  async mounted() {
    await this.table.fetchLookups();
    await this.getRow();

    const list = document.getElementsByTagName('input');

    if (list.length > 0) {
      list[0].focus();
    }
  }

  async getRow() {
    switch (this.state) {
      case EditState.Add:
        this.row = this.table.newRow();
        this.savedRow = Dataset.copyRow(this.row);
        break;

      case EditState.Edit:
        this.row = await this.table.getRow(this.query);
        this.savedRow = Dataset.copyRow(this.row);
        break;
    }
  }

  private sqlError(error) {
    this.errorMessage = error.response.data.sqlMessage;
  }

  private async post() {
    this.posted = true;
    this.missingValues = !this.validate();

    if (this.missingValues)
      return;

    switch (this.state) {
      case EditState.Add:
//        console.log(JSON.stringify(this.row));

        try {
          await this.table.addRow(this.row);
          this.table.database.addedData = new EditedData(this.table.tableName, this.row);
          this.back();
        }
        catch (e) {
          this.sqlError(e);
        }

        break;

      case EditState.Edit:
//        console.log(JSON.stringify(this.savedRow));
//        console.log(JSON.stringify(this.row));

        if (JSON.stringify(this.savedRow) !== JSON.stringify(this.row)) {
          try {
            await this.table.updateRow(this.savedRow, this.row);
            this.table.database.editedData = new EditedData(this.table.tableName, this.row);
            this.back();
          }
          catch (e) {
            this.sqlError(e);
          }
        }
        else
          this.back();


        break;
    }
  }

  private async confirmDelete() {
    if (this.table.confirmDeleteRow(this.row)) {
      try {
        await this.table.deleteRow(this.row);
        this.back();
      }
      catch (e) {
        this.sqlError(e);
      }
    }
  }

  private cancel() {
    this.back();
  }

  private back() {
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
}
</script>

<style scoped>
.code {
  font-family: 'Courier New', Courier, monospace;
}

.missing {
  color: red;
}

.error {
  color: red;
  margin-top: 10px;
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
