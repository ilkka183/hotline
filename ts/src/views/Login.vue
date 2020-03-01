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

<script  lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Login extends Vue {
  private login() {
    this.$router.go(-1);
  }

  private cancel() {
    this.$router.go(-1);
  }
}
</script>
