import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { RestDatabase } from '../lib/dataset';
import { User } from '../js/user'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    database: new RestDatabase(axios.create({
      baseURL: 'http://localhost:3000/api/',
      timeout: 1000
    })),
    user: null
  },
  mutations: {
    LOGIN(state, user) {
      console.log(user.token);

      state.database.axios.defaults.headers.common['x-auth-token'] = user.token;
      state.user = user;
    },
    LOGOUT(state) {
      state.user = null;
    }
  },
  actions: {
    login(context, userLogin) {
      return new Promise<string>((resolve, reject) => {
        context.state.database.axios.post('/auth', userLogin)
        .then(response => {
          const token = response.data;
  
          context.state.database.axios.get('/auth/me', { headers: { 'x-auth-token': token }})
            .then(response => {
              const data = response.data;
              context.commit('LOGIN', new User(token, data));
              resolve('OK');
            })
            .catch(error => {
              reject(error.response);
            });
        })
        .catch(error => {
          console.log(error.response.data);
          reject(error.response.data);
        })
      });
    },
    logout(context) {
      context.commit('LOGOUT');
    }
  },
  getters: {
  }
});
