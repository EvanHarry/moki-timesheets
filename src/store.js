import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'

import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    alert: null,

    loggedIn: false,

    user: null
  },

  mutations: {
    setAlert (state, alert) {
      state.alert = alert
    },

    setLogin (state, login) {
      state.loggedIn = login
    },

    setUser (state, user) {
      state.user = user
    }
  },

  actions: {
    login ({ commit }, uuid) {
      commit('setLogin', true)

      router.push('/')

      firebase.firestore().collection('users').doc(uuid).get()
        .then((doc) => {
          if (doc.exists) {
            const user = doc.data()

            commit('setUser', user)
          }
        })
        .catch((err) => {
          commit('setLogin', false)
          commit('setAlert', {
            msg: err.message,
            type: 'error'
          })
        })
    },

    logout ({ commit }) {
      firebase.auth().signOut()

      commit('setLogin', false)
      commit('setUser', null)

      router.push('/login')
    }
  }
})
