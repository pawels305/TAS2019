import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    userLoaded: false
  },
  mutations: {
    loginUser (state, user) {
      state.user = user
      state.userLoaded = true
    },
    logoutUser (state) {
      state.user = null
    }
  },
  actions: {
    login ({ commit }, user) {
      commit('loginUser', user)
    },
    logout ({ commit }) {
      commit('logoutUser')
    }
  },
  getters: {
    userLoaded: state => state.userLoaded,
    loggedIn: state => !!(state.user && state.user.id),
    username: state => state.user && state.user.username
  }
})
