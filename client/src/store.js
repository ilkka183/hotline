import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: { id: 1, name: 'Ilkka Salmenius' },
  },
  mutations: {
    LOGOUT(state) {
      state.user = null;
    }
  },
  actions: {
    logout(context) {
      context.commit('LOGOUT');
    }
  },
  getters: {
  }
})
