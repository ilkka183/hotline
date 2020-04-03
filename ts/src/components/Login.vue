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
      <button @click="fillTestUser">Testikäyttäjä</button>
    </div>
  </div>
</template>

<script  lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { User, UserType } from '../js/user'

@Component
export default class Login extends Vue {
  private username = null;
  private password = null;
  
  private login() {
    this.$store.dispatch('login', new User(1,UserType.Admin, 'Ilkka', 'Salmenius', '050 61698'));
  }
  
  private fillTestUser() {
    this.username = 'ilkka.salmenius@gmail.com';
    this.password = 'ohion300';
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

