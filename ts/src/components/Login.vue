<template>
  <div class="form">
    <h2>Hotline</h2>
    <div class="form-group">
      <label for="username">Käyttäjätunnus</label>
      <input class="form-control" ref="username" type="text" name="username" :size="30" v-model="username">
    </div>
    <div class="form-group">
      <label for="password">Salasana</label>
      <input class="form-control" ref="password" type="password" name="password" :size="30" v-model="password">
    </div>
    <div class="buttons mb-3">
      <button class="btn btn-primary mr-2" :disabled="!username || !password" @click="doLogin()">Kirjaudu</button>
      <button class="btn btn-secondary mr-2" :disabled="!username && !password" @click="clear">Tyhjennä</button>
      <button class="btn btn-light mr-2" @click="fill('albert', 'weber')">Ilkka</button>
      <button class="btn btn-light mr-2" @click="fill('opeJorma', 'weber')">Jorma</button>
      <button class="btn btn-light mr-2" @click="fill('arto', 'weber')">Arto</button>
      <button class="btn btn-light mr-2" @click="fill('mikko', 'weber')">Mikko</button>
    </div>
    <div class="alert alert-danger alert-dismissible fade show" v-if="errorMessage">
      <div>{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script  lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { User, UserRole } from '../js/user'
import { login } from '../services/authService'

@Component
export default class Login extends Vue {
  private username: string= null;
  private password: string = null;
  private errorMessage: string = null;

  mounted() {
    (this.$refs.username as any).focus();
  }

  public doLogin() {
    login(this.username, this.password)
      .then(response => {
        const token = response.data;
        localStorage.setItem('token', token);
        this.$store.dispatch('setToken', token);
      })
      .catch(error => {
        this.errorMessage = 'Virheellinen käyttäjätunnus tai salasana!';
      });
  }

  private clear() {
    this.username = null;
    this.password = null;
    this.errorMessage = null;
  }
  
  private fill(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}
</script>

<style lang="scss" scoped>
</style>

