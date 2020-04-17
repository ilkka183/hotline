<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-3">
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Koti</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/problems">Vikatapaukset</router-link>
          </li>
            <router-link class="nav-link" to="/notices">Ilmoitukset</router-link>
          <li class="nav-item">
            <router-link class="nav-link" to="/usergroups">Käyttäjäryhmät</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/users">Käyttäjät</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/brands">Automerkit</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/bulletingroups">Tiedoteryhmät</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">Tietoja</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/account">Omat tiedot</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/"><span @click="logout">Kirjaudu ulos</span></router-link>
          </li>
        </ul>
      </div>
    </nav>
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
</style>
