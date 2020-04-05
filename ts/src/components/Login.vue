<template>
  <div>
    <table>
      <tr>
        <td><label for="username">Käyttäjätunnus:</label></td>
        <td><input type="text" name="username" :size="30" autofocus v-model="username"></td>
      </tr>
      <tr>
        <td><label for="password">Salasana:</label></td>
        <td><input type="password" name="password" :size="30" v-model="password"></td>
      </tr>
    </table>
    <div class="buttons">
      <button :disabled="!username || !password" @click="login">Kirjaudu</button>
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
import Base from './Base.vue';

@Component
export default class Login extends Base {
  private username = null;
  private password = null;
  
  private login() {
    this.axios.post('/auth', { username: this.username, password: this.password })
      .then(response => {
        const token = response.data;

        this.axios.get('/auth/me', { headers: { 'x-auth-token': token }})
          .then(response => {
            const data = response.data;

            this.$store.dispatch('login', new User(token, data));
          })
          .catch(error => {
            console.log(error.response);
          });
      })
      .catch(error => {
         console.log(error.response);
         window.alert('Virheellinen käyttäjätunnus tai salasana');
      })
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
.buttons {
  margin-top: 10px;

  button {
    margin-right: 5px;
  }
}
</style>

