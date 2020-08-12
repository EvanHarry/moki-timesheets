import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    alert: null,

    user: null
  },

  mutations: {
    setAlert (state, alert) {
      state.alert = alert
    },

    setUser (state, user) {
      state.user = user
    }
  }
})
