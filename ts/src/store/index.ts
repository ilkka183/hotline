import Vue from "vue";
import Vuex from "vuex";
import { RestDatabase } from '@/lib/dataset'
import { User, UserType } from '@/js/user'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    database: new RestDatabase('http://localhost:3000', '/api/'),
    user: null
  },
  mutations: {
    LOGIN(state, user) {
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
