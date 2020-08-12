import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import Vue from 'vue'

import config from './config'

firebase.initializeApp(config)

const firebasePlugin = {}
firebasePlugin.install = (Vue) => {
    Vue.prototype.$firebase = firebase
}

Vue.use(firebasePlugin)
