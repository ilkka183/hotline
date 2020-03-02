<template>
  <div class="parent">
    <div>
      <h2>Kirjaudu</h2>
      <div class="block">
        <div>Käyttäjätunnus:</div>
        <input type="text" :size="40" autofocus v-model="username">
      </div>
      <div class="block">
        <div>Salasana:</div>
        <input type="password" :size="40" v-model="password">
      </div>
      <div class="block buttons">
        <button @click="login">OK</button>
        <button @click="cancel">Peru</button>
      </div>
    </div>
  </div>
</template>

<script  lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { User, UserType } from '@/js/user'

@Component
export default class Login extends Vue {
  private username = 'ilkka.salmenius@gmail.com';
  private password = 'ohion300';
  
  private login() {
    this.$store.dispatch('login', new User(1, 'Ilkka', 'Salmenius', UserType.Admin));
    this.$router.go(-1);
  }

  private cancel() {
    this.$router.go(-1);
  }
}
</script>

<style lang="scss">
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

