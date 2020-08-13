import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store'

Vue.use(VueRouter)

let router = new VueRouter({
  routes: [
    {
      component: () => import('@/views/Login'),
      meta: {
        requiresAuth: false
      },
      name: 'Login',
      path: '/login'
    },
    {
      component: () => import('@/views/Register'),
      meta: {
        requiresAuth: false
      },
      name: 'Register',
      path: '/register'
    },
    {
      component: () => import('@/views/Home'),
      meta: {
        requiresAuth: true
      },
      name: 'Home',
      path: '/'
    },
    {
      component: () => import('@/views/Timesheets'),
      meta: {
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

const authMiddleware = (router) => {
  router.beforeEach((to, from, next) => {
    const loggedIn = store.state['loggedIn']

    if (to.matched.some(m => m.meta.requiresAuth)) {
      if (loggedIn) {
        next()
      } else {
        next('/login')
      }
    } else {
      if (loggedIn) {
        next('/')
      } else {
        next()
      }
    }
  })
}

const miscMiddleware = (router) => {
  router.beforeEach((to, from, next) => {
    if (to.path === from.path) {
      return
    } else {
      next()
    }
  })
}

authMiddleware(router)
miscMiddleware(router)

export default router
