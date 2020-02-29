<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Koti</router-link> |
      <router-link to="/problems/0">Vikatapaukset</router-link> |
      <router-link to="/problems/1">Tiedotteet</router-link> |
      <router-link to="/notices">Ilmoitukset</router-link> |
      <router-link to="/clientgroups">Käyttäjäryhmät</router-link> |
      <router-link to="/clients">Käyttäjät</router-link> |
      <router-link to="/brands">Automerkit</router-link> |
      <router-link to="/vehicles">Autot</router-link> |
      <router-link to="/bulletingroups">Tiedoteryhmät</router-link> |
      <router-link to="/test">Testi</router-link> |
      <router-link to="/about">Tietoja</router-link> |
      <router-link to="/"><span @click="$store.dispatch('logout')">Kirjaudu ulos</span></router-link> |
      <router-link to="/login">Kirjaudu sisään</router-link>
    </div>
    <router-view :key="$route.fullPath"/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: left;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
