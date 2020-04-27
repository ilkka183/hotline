import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { RestDatabase } from '../lib/dataset';
import jwtDecode from 'jwt-decode';
import { apiUrl } from '../config.json';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    database: new RestDatabase(axios.create({
      baseURL: apiUrl,
      timeout: 10000
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
    axios: state=> {
      return state.database.axios;
    },
    fullName: state=> {
      return state.user ? state.user.firstName + ' ' + state.user.lastName : '';
    }
  }
});
