import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { RestDatabase } from '../lib/dataset';
import jwtDecode from 'jwt-decode';
import { User } from '../js/user'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    database: new RestDatabase(axios.create({
      baseURL: 'http://localhost:3000/api/',
      timeout: 1000
    })),
    token: null,
    user: null
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.database.axios.defaults.headers.common['x-auth-token'] = token;
      state.token = token;

      if (token) {
        const user = jwtDecode(token);
        state.user = user;
      } else {
        state.user = null;
      }
    }
  },
  actions: {
    setToken(context, token) {
      context.commit('SET_TOKEN', token);
    },
    login(context, token) {
      localStorage.setItem('token', token);
      context.commit('SET_TOKEN', token);
    },
    logout(context) {
      localStorage.removeItem('token');
      context.commit('SET_TOKEN', null);
    }
  },
  getters: {
  }
});
