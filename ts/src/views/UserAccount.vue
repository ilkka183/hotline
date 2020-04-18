<template>
  <main class="container">

    <div class="form">
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
      <button class="btn btn-primary mb-3" @click="save">Tallenna</button>
      <div class="alert alert-success alert-dismissible fade show" v-if="updateSuccess">
        <div>{{ updateSuccess }}</div>
      </div>
    </div>

    <div class="form">
      <h3>Vaihda salasana</h3>
      <div class="form-group">
        <label for="password1">Salasana</label>
        <input class="form-control" name="password1" type="password" v-model="password1">
      </div>
      <div class="form-group">
        <label for="password2">Salasana uudestaan</label>
        <input class="form-control" name="password2" type="password" v-model="password2">
      </div>
      <button class="btn btn-primary mb-3" @click="changePassword" :disabled="!password1 || !password2">Vaihda salasana</button>
      <div class="alert alert-success alert-dismissible fade show" v-if="changePasswordSuccess">
        <div>{{ changePasswordSuccess }}</div>
      </div>
      <div class="alert alert-danger alert-dismissible fade show" v-if="changePasswordError">
        <div>{{ changePasswordError }}</div>
      </div>
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
  private phone: string = null;
  private password1: string = null;
  private password2: string = null;
  private updateSuccess: string = null;
  private changePasswordSuccess: string = null;
  private changePasswordError: string = null;

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

  private resetAlerts() {
    this.updateSuccess = null;
    this.changePasswordSuccess = null;
    this.changePasswordError = null;
  }

  private async save() {
    const fields = {
      Phone: this.phone
    }

    this.resetAlerts();

    await this.update(fields);
    this.updateSuccess = 'Muutokset tallennettu';
  }

  private async changePassword() {
    const MIN_LENGTH = 5;

    this.resetAlerts();

    if ((this.password1.length < MIN_LENGTH) || (this.password2.length < MIN_LENGTH)) {
      this.changePasswordError = 'Salasanan pituus tulee olla vähintään viisi merkkiä!';
      return;
    }

    if (this.password1 !== this.password2) {
      this.changePasswordError = 'Annetut salasanat eivät täsmää!';
      return;
    }
   
    const fields = {
      Password: this.password1
    }

    await this.update(fields);
    this.password1 = null;
    this.password2 = null;
    this.changePasswordSuccess = 'Salasana vaihdettu';
  }
}
</script>
