<template>
  <div id="app">
    <NavBar/>
    <router-view :key="$route.fullPath"/>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';

export default {
  components: {
    NavBar
  }
}
</script>

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
