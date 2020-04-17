<template>
  <main class="container">

    <div class="form-group mb-5">
      <h2>Omat tiedot</h2>
      <div class="form-group">
        <label for="firstName">Etunimi</label>
        <input class="form-control" name="firstName" :value="user.firstName" readonly>
      </div>
      <div class="form-group">
        <label for="lastName">Etunimi</label>
        <input class="form-control" name="lastName" :value="user.lastName" readonly>
      </div>
      <div class="form-group">
        <label for="role">Rooli</label>
        <input class="form-control" name="role" v-model="user.roleText" readonly>
      </div>
      <div class="form-group">
        <label for="phone">Puhelinnumero</label>
        <input class="form-control" name="phone" v-model="phone">
      </div>
      <button class="btn btn-primary" @click="save">Tallenna</button>
    </div>

    <div class="form-group">
      <h3>Vaihda salasana</h3>
      <div class="form-group">
        <label for="password1">Salasana</label>
        <input class="form-control" name="password1" type="password" v-model="password1">
      </div>
      <div class="form-group">
        <label for="password2">Salasana uudestaan</label>
        <input class="form-control" name="password2" type="password" v-model="password2">
      </div>
      <button class="btn btn-primary" @click="changePassword" :disabled="!password1 || !password2">Vaihda salasana</button>
    </div>

  </main>
</template>

<script  lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { rest } from '../js/rest';
import { User } from '../js/user';
import BaseVue from './BaseVue.vue';

@Component
export default class UserInfo extends BaseVue {
  private phone = '';
  private password1 = '';
  private password2 = '';

  mounted() {
    if (this.user)
      this.phone = this.user.phone;
  }

  private async update(fields: object) {
    const url = '/table/user';

    const keys = {
      Id: this.user.id
    }

    await this.axios.put(url, fields, { params: keys });
  }

  private async save() {
    const fields = {
      Phone: this.phone
    }

    await this.update(fields);
    alert('Muutokset tallenettu');
  }

  private async changePassword() {
    const MIN_LENGTH = 5;

    if ((this.password1.length < MIN_LENGTH) || (this.password2.length < MIN_LENGTH)) {
      alert('Salasanan pituus tulee olla vähintään viisi merkkiä!');
      return;
    }

    if (this.password1 !== this.password2) {
      alert('Annetut salasanat eivät täsmää!');
      return;
    }

    const fields = {
      Password: this.password1
    }

    await this.update(fields);
    this.password1 = '';
    this.password2 = '';
    alert('Salasana vaihdettu');
  }
}
</script>
