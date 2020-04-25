<template>
  <nav><slot></slot></nav>
</template>

<script>
export default {
}
</script>

<style scoped>
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
