<template>
  <div>
    <table>
      <tr>
        <td><label for="username">Käyttäjätunnus:</label></td>
        <td><input ref="username" type="text" name="username" :size="30" autofocus v-model="username"></td>
      </tr>
      <tr>
        <td><label for="password">Salasana:</label></td>
        <td><input ref="password" type="password" name="password" :size="30" v-model="password"></td>
      </tr>
    </table>
    <div class="buttons">
      <button :disabled="!username || !password" @click="login(username, password)">Kirjaudu</button>
      <button @click="clear">Tyhjennä</button>
      <button @click="fill('albert', 'weber')">Ilkka</button>
      <button @click="fill('opeJorma', 'weber')">Jorma</button>
      <button @click="fill('arto', 'weber')">Arto</button>
    </div>
  </div>
</template>

<script  lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { User, UserRole } from '../js/user'
import BaseVue from './BaseVue.vue';

@Component
export default class Login extends BaseVue {
  private username = null;
  private password = null;

  mounted() {
    (this.$refs.username as any).focus();
  }
  
  private clear() {
    this.username = null;
    this.password = null;
  }
  
  private fill(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}
</script>

<style lang="scss">
</style>

