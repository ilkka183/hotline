<template>
  <div class="form">
    <h2>Kirjaudu</h2>

    <b-form-group label="Käyttäjätunnus" label-for="username">
      <b-form-input type="text" ref="username" id="username" v-model="username" />
    </b-form-group>

    <b-form-group label="Salasana" label-for="password">
      <b-form-input type="password" ref="password" id="password" v-model="password" />
    </b-form-group>

    <div class="buttons mb-3">
      <b-button variant="primary" class="mr-2" :disabled="!username || !password" @click="onLogin">Kirjaudu</b-button>
      <b-button variant="secondary" class="mr-2" :disabled="!username && !password" @click="onClear">Tyhjennä</b-button>
      <b-button variant="outline-light" class="mr-2" @click="onFill('albert', 'weber')">Ilkka</b-button>
      <b-button variant="outline-light" class="mr-2" @click="onFill('opeJorma', 'weber')">Jorma</b-button>
      <b-button variant="outline-light" class="mr-2" @click="onFill('arto', 'weber')">Arto</b-button>
      <b-button variant="outline-light" class="mr-2" @click="onFill('mikko', 'weber')">Mikko</b-button>
    </div>

    <b-alert variant="danger" fade show v-if="errorMessage">{{ errorMessage }}</b-alert>
  </div>
</template>

<script  lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { User, UserRole } from '../js/user'
import { login } from '../services/authService'

@Component
export default class Login extends Vue {
  private username: string = null;
  private password: string = null;
  private errorMessage: string = null;

  mounted() {
    (this.$refs.username as any).focus();
  }

  private onLogin() {
    login(this.username, this.password)
      .then(response => {
        this.$store.dispatch('login', response.data);
      })
      .catch(error => {
        this.errorMessage = 'Virheellinen käyttäjätunnus tai salasana!';
      });
  }

  private onClear() {
    this.username = null;
    this.password = null;
    this.errorMessage = null;
  }
  
  private onFill(username: string, password: string) {
    this.username = username;
    this.password = password;
    this.errorMessage = null;
  }
}
</script>

<style lang="scss" scoped>
</style>

