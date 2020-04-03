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
      <button @click="login">Kirjaudu</button>
      <button @click="fill('albert', 'ilkka')">Ilkka</button>
      <button @click="fill('opeJorma', 'weber')">Jorma</button>
    </div>
  </div>
</template>

<script  lang="ts">
import axios from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { User, UserType } from '../js/user'

@Component
export default class Login extends Vue {
  private username = null;
  private password = null;
  
  private login() {
    axios.post('http://localhost:3000/api/auth', { username: this.username, password: this.password })
      .then(response => {
        const token = response.data;

        axios.get('http://localhost:3000/api/auth/me', { headers: { 'x-auth-token': token }})
          .then(response => {
            const data = response.data;
            this.$store.dispatch('login', new User(data.id, UserType.Admin, data.firstName, data.lastName, data.phone));
          })
          .catch(error => {
            console.log(error.response);
          });
      })
      .catch(error => {
         console.log(error.response);
      })
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

