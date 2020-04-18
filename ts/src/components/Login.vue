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
    <div class="buttons mb-3">
      <button class="btn btn-primary mr-2" :disabled="!username || !password" @click="login()">Kirjaudu</button>
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

@Component
export default class Login extends Vue {
  private username: string= null;
  private password: string = null;
  private errorMessage: string = null;

  mounted() {
    (this.$refs.username as any).focus();
  }

  private login(username: string, password: string) {
    this.$store.dispatch('login', { username: this.username, password: this.password })
      .catch(error => this.errorMessage = 'Virheellinen käyttäjätunnus tai salasana!')
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

<style lang="scss">
.error {

}
</style>

