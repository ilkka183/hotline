<template>
  <div>
    <h1>{{caption}}</h1>
    <form @submit.prevent="post" @keydown.esc="cancel">
      <table>
        <tr v-for="(field, index) in fields" v-bind:key="index">
          <td> <!-- caption -->
            <div v-if="field.showDialogCaption()">
              <span :class="{ missing: isMissing(field)}">{{field.caption}}:</span>
              <span v-if="field.required && !field.isReadOnly()" class="required-asterix"></span>
            </div>
          </td>
          <td> <!-- control -->
            <div v-if="field.isReadOnly()" :class="{ value: true, code: field.isCode() }">{{field.displayText(row)}}</div>
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
import TableComponent from './TableComponent';

export default {
  extends: TableComponent,
  props: {
    row: { type: Object, required: true }
  },
  data() {
    return {
      posted: false
    }
  },
  computed: {
    caption() {
      if (this.table.isAdding) {
        return this.dataset.getAddCaption();
      } else if (this.table.isEditing) {
        return this.dataset.getEditCaption();
      }

      return '';
    },
    fields() {
      return this.dataset.fields.filter(field => field.isVisibleInDialog(this.row));
    },
  },
  mounted() {
    for (let field of this.fields)
      if (!field.isReadOnly())
        field.findLookupList();

    this.posted = false;
  },
  methods: {
    isMissing(field) {
      return this.posted && !field.isValid(this.row);
    },
    post() {
      this.posted = true;

      if (!this.validate())
        return;

      this.table.postEdit();
    },
    cancel() {
      this.table.cancelEdit();
    },
    validate() {
      for (let field of this.dataset.fields) {
        if (!field.isValid(this.row) && !field.isReadOnly())
        {
          if (this.$refs[field.name])
            this.$refs[field.name][0].focus();

          return false;
        }
      }

      return true;
    }
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