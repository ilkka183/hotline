<template>
  <div id="app">
    <b-navbar toggleable="lg" type="light" variant="light">
      <b-navbar-brand to="/">Hotline</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav  v-if="$store.state.token">
          <b-nav-item to="/">Koti</b-nav-item>
          <b-nav-item to="/problems">Vikatapaukset</b-nav-item>
          <b-nav-item to="/notices">Ilmoitukset</b-nav-item>
          <b-nav-item-dropdown text="Asetukset">
            <b-nav-item to="/usergroups">Käyttäjäryhmät</b-nav-item>
            <b-nav-item to="/users">Käyttäjät</b-nav-item>
            <b-nav-item to="/brands">Automerkit</b-nav-item>
            <b-nav-item to="/bulletingroups">Tiedoteryhmät</b-nav-item>
          </b-nav-item-dropdown>
          <b-nav-item to="/about">Tietoja</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto" v-if="$store.state.token">
          <b-nav-item-dropdown :text="$store.state.user.fullName" right>
            <b-nav-item to="/account">Omat tiedot</b-nav-item>
          </b-nav-item-dropdown>
          <b-nav-item to="/login"><span @click="logout">Kirjaudu ulos</span></b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto" v-else>
          <b-nav-item to="/login">Kirjaudu sisään</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view :key="$route.fullPath"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {
  mounted() {
    const token = localStorage.getItem('token');
    this.$store.dispatch('setToken', token);
  }

  private logout() {
    this.$store.dispatch('logout', null);
  }
}
</script>

<style lang="scss">
h2 {
  margin-bottom: 10px !important;
}

.navbar {
  margin-bottom: 20px;
}
</style>
