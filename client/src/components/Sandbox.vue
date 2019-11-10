<template>
  <div>
    <h1>Sandbox</h1>
    <form @submit.prevent="post" @keydown.esc="cancel">
    <table>
      <tr v-for="(field, index) in fields1" :key="index">
        <td>{{field.name}}:</td>
        <td><input type="text" :ref="field.name" autofocus="true" v-model="row1[field.name]"></td>
      </tr>
      <tr v-for="(field, index) in fields1" :key="index + 10">
        <td>{{field.name}}:</td>
        <td><input type="text" :ref="field.name" autofocus="true" v-model="row1[field.name]"></td>
      </tr>
    </table>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fields1: [
        { name: 'id' },
        { name: 'name' },
        { name: 'address' },
        { name: 'phone' },
      ],
      rows1: [
        { id: 1, name: 'Ilkka', address: 'Kausala', phone: '050 61698' },
        { id: 2, name: 'Jaakko', address: 'Espoo', phone: '050 61699' },
        { id: 3, name: 'Mikko', address: 'Lahti', phone: '050 61688' },
        { id: 4, name: 'Ulla', address: 'Mankala', phone: '050 61694' },
      ]
    }
  },
  computed: {
    row1() {
      return this.rows1[0];
    },
    visibleFields() {
      return this.fields.filter(() => true)
    }
  },
  methods: {
    post() {
    },
    cancel() {
    },
  }
}
</script>

<style scoped>
</style>
