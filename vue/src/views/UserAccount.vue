<template>
  <b-container>

    <b-form>
      <h2>Omat tiedot</h2>

      <b-form-group label="Etunimi" label-for="firstName">
        <b-form-input name="firstName" :value="user.firstName" readonly />
      </b-form-group>

      <b-form-group label="Etunimi" label-for="lastName">
        <b-form-input name="lastName" :value="user.lastName" readonly />
      </b-form-group>

      <b-form-group label="Rooli" label-for="role">
        <b-form-input name="role" v-model="userRoleText" readonly />
      </b-form-group>

      <b-form-group label="Lähiosoite" label-for="address">
        <b-form-input name="address" v-model="address" />
      </b-form-group>

      <b-form-group label="Postinumero" label-for="postalCode">
        <b-form-input name="postalCode" v-model="postalCode" />
      </b-form-group>

      <b-form-group label="Postitoimipaikka" label-for="postOffice">
        <b-form-input name="postOffice" v-model="postOffice" />
      </b-form-group>

      <b-form-group label="Maa" label-for="country">
        <b-form-input name="country" v-model="country" />
      </b-form-group>

      <b-form-group label="Puhelinnumero" label-for="phone">
        <b-form-input name="phone" v-model="phone" />
      </b-form-group>

      <b-button variant="primary" class="mb-3" @click="save">Tallenna</b-button>
      <b-alert variant="success" fade show v-if="updateSuccess">{{ updateSuccess }}</b-alert>
    </b-form>

    <b-form>
      <h3>Vaihda salasana</h3>

      <b-form-group label="Salasana" label-for="password1">
        <b-form-input name="password1" type="password" v-model="password1" />
      </b-form-group>

      <b-form-group label="Salasana uudestaan" label-for="password2">
        <b-form-input name="password2" type="password" v-model="password2" />
      </b-form-group>

      <b-button variant="primary" class="mb-3" @click="changePassword" :disabled="!password1 || !password2">Vaihda salasana</b-button>
      <b-alert variant="success" fade show v-if="changePasswordSuccess">{{ changePasswordSuccess }}</b-alert>
      <b-alert variant="danger" fade show v-if="changePasswordError">{{ changePasswordError }}</b-alert>
    </b-form>

  </b-container>
</template>

<script  lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { rest } from '../js/rest';
import { User } from '../js/user';
import BaseVue from './BaseVue.vue';

@Component
export default class UserInfo extends BaseVue {
  private address: string = null;
  private postalCode: string = null;
  private postOffice: string = null;
  private country: string = null;
  private phone: string = null;
  private password1: string = null;
  private password2: string = null;
  private updateSuccess: string = null;
  private changePasswordSuccess: string = null;
  private changePasswordError: string = null;

  async mounted() {
    if (this.user) {
      console.log(this.user);

      const { data } = await this.$store.getters.axios.get('/table/User/row?Id=' + this.user.id);

      if (data.length > 0) {
        const row = data[0];

        console.log(row);

        this.address = row.Address;
        this.postalCode = row.PostalCode;
        this.postOffice = row.PostOffice;
        this.country = row.Country;
        this.phone = row.Phone;
      }
    }
  }

  protected get userRoleText(): string {
    return User.typeTexts[this.user.role];
  }

private async update(fields: object) {
    const url = '/table/User';

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
      Address: this.address,
      PostalCode: this.postalCode,
      PostOffice: this.postOffice,
      Country: this.country,
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
