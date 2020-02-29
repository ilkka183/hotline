<template>
  <div id="app">
    <v-header>
      <router-link to="/">Koti</router-link> |
      <template v-if="$store.state.user">
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
        <router-link to="/"><span @click="$store.dispatch('logout')">Kirjaudu ulos</span></router-link>
      </template>
      <template v-else >
        <router-link to="/login">Kirjaudu sisään</router-link>
      </template>
    </v-header>
    <router-view :key="$route.fullPath"/>
  </div>
</template>

<script>
export default {
  components: {
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #2c3e50;
}

h1 {
  margin-block-start: 0.2em;
  margin-block-end: 0.3em;
}

h2 {
  margin-block-start: 0.4em;
  margin-block-end: 0.1em;
}

.block {
  margin-top: 5px;
}

.buttons {
}

.buttons button {
  margin-right: 5px;
}
</style>
