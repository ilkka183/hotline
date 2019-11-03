<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Koti</router-link> |
      <router-link to="/problems">Vikatapaukset</router-link> |
      <router-link to="/notices">Ilmoitukset</router-link> |
      <router-link to="/clientgroups">Käyttäjäryhmät</router-link> |
      <router-link to="/clients">Käyttäjät</router-link> |
      <router-link to="/brands">Automerkit</router-link> |
      <router-link to="/vehicles">Autot</router-link> |
      <router-link to="/bulletingroups">Tiedoteryhmät</router-link> |
      <router-link to="/about">Tietoja</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #2c3e50;
}

#nav {
  padding-top: 10px;
  padding-bottom: 10px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
