import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { RestDatabase } from '@/lib/dataset'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    database: new RestDatabase('http://localhost:3000', '/api/'),
    rest: axios.create({
      baseURL: 'http://localhost:3000/api/',
      timeout: 1000
    }),
    user: null
  },
  mutations: {
    LOGIN(state, user) {
      state.rest.defaults.headers.common['x-auth-token'] = user.token;
      state.user = user;
    },
    LOGOUT(state) {
      state.user = null;
    }
  },
  actions: {
    login(context, user) {
      context.commit('LOGIN', user);
    },
    logout(context) {
      context.commit('LOGOUT');
    }
  },
  getters: {
  }
});
