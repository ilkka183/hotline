<template>
  <div id="app">
    <div id="nav">
      <span class="left">
        <template v-if="$store.state.user">
          <router-link to="/">Koti</router-link> |
          <router-link to="/problems/0">Vikatapaukset</router-link> |
          <router-link to="/problems/1">Tiedotteet</router-link> |
          <router-link to="/notices">Ilmoitukset</router-link> |
          <router-link to="/clientgroups">Käyttäjäryhmät</router-link> |
          <router-link to="/clients">Käyttäjät</router-link> |
          <router-link to="/brands">Automerkit</router-link> |
          <router-link to="/bulletingroups">Tiedoteryhmät</router-link> |
          <router-link to="/about">Tietoja</router-link> |
          <router-link to="/test">Testi</router-link>
        </template>
      </span>
      <span class="right">
        <template v-if="$store.state.user">
          <router-link to="/user">{{ $store.state.user.name }}</router-link> |
          <router-link to="/"><span @click="logout">Kirjaudu ulos</span></router-link>
        </template>
      </span>
    </div>
    <router-view :key="$route.fullPath"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Aoo extends Vue {
  private logout() {
    this.$store.dispatch('logout');
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: left;
  color: #2c3e50;
}

#nav {
  padding-top: 5px;
  padding-bottom: 10px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.left {
}

.right {
  float: right;
}

.buttons {
  margin-top: 10px;

  button {
    margin-right: 5px;
  }

  .right {
    float: right;
  }
}
</style>
