import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)

export default new vuex.Store({
  state: {
    user: null
  },

getters: {
    isAdmin (state) {
      return !!state.user && state.user.admin
    },

    loggedIn (state) {
      return !!state.user
    }
  },

  mutations: {
    setUser (state, user) {
      state.user = user
    }
  }
})
