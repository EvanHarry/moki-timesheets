import Vue from 'vue'
import VueRouter from 'vue-router'

import firebase from 'firebase/app'

Vue.use(VueRouter)

let router = new VueRouter({
  routes: [
    {
      component: () => import('@/views/Login'),
      meta: {
        requiresAdmin: false,
        requiresAuth: false
      },
      name: 'Login',
      path: '/login'
    },
    {
      component: () => import('@/views/Register'),
      meta: {
        requiresAdmin: false,
        requiresAuth: false
      },
      name: 'Register',
      path: '/register'
    },
    {
      component: () => import('@/views/Home'),
      meta: {
        requiresAdmin: false,
        requiresAuth: true
      },
      name: 'Home',
      path: '/'
    },
    {
      component: () => import('@/views/Timesheets'),
      meta: {
        requiresAdmin: true,
        requiresAuth: true
      },
      name: 'Timesheets',
      path: '/timesheets'
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.requiresAuth)) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        next()
      } else {
        next('/login')
      }
    })
  } else {
    next()
  }
})

export default router
