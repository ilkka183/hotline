<template>
  <div>
    <h1>Sandbox</h1>
    <form @submit.prevent="post" @keydown.esc="cancel">
    <table>
      <tr v-for="(field, index) in fields1" :key="index">
        <td>{{ field.name }}:</td>
        <td><input type="text" :ref="field.name" autofocus="true" v-model="row1[field.name]"></td>
      </tr>
      <tr v-for="(field, index) in fields1" :key="index + 10">
        <td>{{ field.name }}:</td>
        <td><input type="text" :ref="field.name" autofocus="true" v-model="row1[field.name]"></td>
      </tr>
    </table>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Sandbox extends Vue {
  private fields1: [
    { name: 'id' },
    { name: 'name' },
    { name: 'address' },
    { name: 'phone' },
  ];

  private rows1: [
    { id: 1, name: 'Ilkka', address: 'Kausala', phone: '050 61698' },
    { id: 2, name: 'Jaakko', address: 'Espoo', phone: '050 61699' },
    { id: 3, name: 'Mikko', address: 'Lahti', phone: '050 61688' },
    { id: 4, name: 'Ulla', address: 'Mankala', phone: '050 61694' },
  ];

  get row1() {
    return this.rows1[0];
  }

  get visibleFields() {
    return this.fields1.filter(() => true)
  }

  private post() {
    //
  }

  private cancel() {
    //
  }
}
</script>

<style scoped>
</style>
