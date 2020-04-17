<template>
  <div>
    <div class="form-group">
      <label for="username">Käyttäjätunnus</label>
      <input class="form-control" ref="username" type="text" name="username" :size="30" autofocus v-model="username">
    </div>
    <div class="form-group">
      <label for="password">Salasana</label>
      <input class="form-control" ref="password" type="password" name="password" :size="30" v-model="password">
    </div>
    <div class="buttons">
      <button class="btn btn-primary mr-2" :disabled="!username || !password" @click="login(username, password)">Kirjaudu</button>
      <button class="btn btn-secondary mr-2" @click="clear">Tyhjennä</button>
      <button class="btn btn-light mr-2" @click="fill('albert', 'weber')">Ilkka</button>
      <button class="btn btn-light mr-2" @click="fill('opeJorma', 'weber')">Jorma</button>
      <button class="btn btn-light mr-2" @click="fill('arto', 'weber')">Arto</button>
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

