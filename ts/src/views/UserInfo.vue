<template>
  <div>
    <h2>Omat tiedot</h2>
    <table v-if="user">
      <tr>
        <td>No:</td>
        <td>{{ user.id }}</td>
      </tr>
      <tr>
        <td>Nimi:</td>
        <td>{{ user.name }}</td>
      </tr>
      <tr>
        <td>Rooli:</td>
        <td>{{ user.roleText }}</td>
      </tr>
      <tr>
        <td>Puhelinnumero:</td>
        <td><input type="tel" v-model="phone"></td>
      </tr>
    </table>
    <button @click="save">Tallenna</button>
    <h3>Vaihda salasana</h3>
    <table>
      <tr>
        <td>Salasana:</td>
        <td><input type="password" v-model="password1"></td>
      </tr>
      <tr>
        <td>Salasana uudestaan:</td>
        <td><input type="password" v-model="password2"></td>
      </tr>
    </table>
    <button @click="changePassword" :disabled="!password1 || !password2">Vaihda salasana</button>
  </div>
</template>

<script  lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { rest } from '../js/rest';
import { User } from '../js/user';
import Base from '../components/Base.vue';

@Component
export default class UserInfo extends Base {
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
