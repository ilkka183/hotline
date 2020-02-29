import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.component('v-button', () => import('@/base/Button.vue'));
Vue.component('v-buttons', () => import('@/base/Buttons.vue'));
Vue.component('v-content', () => import('@/base/Content.vue'));
Vue.component('v-footer', () => import('@/base/Footer.vue'));
Vue.component('v-header', () => import('@/base/Header.vue'));
Vue.component('v-nav-bar', () => import('@/base/NavBar.vue'));
Vue.component('v-section', () => import('@/base/Section.vue'));

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
