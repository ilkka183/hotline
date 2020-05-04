<template>
  <div class="form">
    <h2>Kirjaudu</h2>

    <b-form-group label="Sähköpostiosoite" label-for="email">
      <b-form-input type="text" ref="email" id="email" v-model="email" />
    </b-form-group>

    <b-form-group label="Salasana" label-for="password">
      <b-form-input type="password" ref="password" id="password" v-model="password" />
    </b-form-group>

    <div class="buttons mb-3">
      <b-button variant="primary" class="mr-2" :disabled="!email || !password" @click="onLogin">Kirjaudu</b-button>
      <b-button variant="secondary" class="mr-2" :disabled="!email && !password" @click="onClear">Tyhjennä</b-button>
      <b-button variant="outline-light" class="mr-2" @click="onFill('ilkka.salmenius@iki.fi', 'weber')">Ilkka</b-button>
      <b-button variant="outline-light" class="mr-2" @click="onFill('jorma.hoyteinen@hmv-systems.fi', 'weber')">Jorma</b-button>
      <b-button variant="outline-light" class="mr-2" @click="onFill('arto.aalto@prodiags.com', 'weber')">Arto</b-button>
      <b-button variant="outline-light" class="mr-2" @click="onFill('jan.froberg@hmv-systems.fi', 'Kawasaki')">Janne</b-button>
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
  private email: string = null;
  private password: string = null;
  private errorMessage: string = null;

  mounted() {
    (this.$refs.email as any).focus();
  }

  private onLogin() {
    login(this.email, this.password)
      .then(response => {
        this.$store.dispatch('login', response.data);
        this.$emit('login');
      })
      .catch(error => {
        this.errorMessage = 'Virheellinen sähköpostiosoite tai salasana!';
      });
  }

  private onClear() {
    this.email = null;
    this.password = null;
    this.errorMessage = null;
  }
  
  private onFill(email: string, password: string) {
    this.email = email;
    this.password = password;
    this.errorMessage = null;
  }
}
</script>

<style lang="scss" scoped>
</style>

