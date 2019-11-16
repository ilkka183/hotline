<template>
  <div>
    <h1>Kirjaudu</h1>
    <div class="block">
      <div>Käyttäjätunnus:</div>
      <input type="text" autofocus>
    </div>
    <div class="block">
      <div>Salasana:</div>
      <input type="password">
    </div>
    <div class="block buttons">
      <button @click="login">OK</button>
      <button @click="cancel">Peru</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    login() {
      this.$router.go(-1);
    },
    cancel() {
      this.$router.go(-1);
    }
  }
}
</script>
